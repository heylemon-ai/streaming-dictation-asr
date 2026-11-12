/**
 * Scores cached results and writes a dated folder under results/:
 *
 *   summary.md          the readable report: accuracy with 95% intervals, formatted
 *                       accuracy, error types, latency, failures, non-speech output,
 *                       paired comparisons
 *   results.json        the same aggregates plus run metadata
 *
 * Nothing written to results/ contains audio, references,
 * transcripts or clip ids. Per-clip detail for debugging goes to
 * cache/clips/<folder>.tsv, which is gitignored.
 *
 * Scoring choices:
 *  - Accuracy uses run 0 of each clip; latency uses every run.
 *  - A clip the client dropped (too little audio passed its gate) is scored as an
 *    empty transcript, because that is what the person receives.
 *  - Connection failures and timeouts are infrastructure, not recognition: they are
 *    counted under failures and left out of accuracy.
 *  - Clips with an empty reference are non-speech: scored only on whether any text came back.
 *    A timeout with no text on such a clip counts as "no text", not as a failure.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { ENGINES } from "./engines";
import type { TranscribeResult } from "./engines/types";
import type { Clip, SetDef } from "./manifest";
import { writeTsv } from "./manifest";
import { ROOT } from "./profile";
import { rate, scoreClip, type ClipScores, type Score } from "./score";
import { bootstrapRate, pairedBootstrap, percentile, type Interval } from "./stats";

export type RunRecord = { engine: string; engineLabel: string; model: string; run: number; clip: Clip; result: TranscribeResult };

type Scored = RunRecord & { scores: ClipScores | null; dropped: boolean; failed: boolean };

const pct = (x: number) => `${(x * 100).toFixed(1)}%`;
const iv = (i: Interval) => `${pct(i.value)} <small>[${pct(i.lo)}–${pct(i.hi)}]</small>`;
const sumScores = (xs: Score[]) => xs.reduce((a, s) => ({ errors: a.errors + s.errors, refLen: a.refLen + s.refLen, sub: a.sub + s.sub, del: a.del + s.del, ins: a.ins + s.ins, hypLen: a.hypLen + s.hypLen }), { errors: 0, refLen: 0, sub: 0, del: 0, ins: 0, hypLen: 0 });

function score(r: RunRecord): Scored {
	const err = r.result.error;
	const nonSpeech = !r.clip.reference.trim();
	const dropped = !!err && err.startsWith("dropped");
	// On non-speech audio, some engines never close the session because nothing was heard.
	// A timeout with no text there means "returned nothing", which is the correct outcome.
	const silentTimeout = nonSpeech && !!err && err.startsWith("timeout") && !r.result.text.trim();
	const failed = !!err && !dropped && !silentTimeout;
	const scores = failed || nonSpeech ? null : scoreClip(r.clip.reference, dropped ? "" : r.result.text, r.clip.language);
	return { ...r, scores, dropped, failed };
}

export function writeResults(records: RunRecord[], meta: { label?: string; options: Record<string, unknown>; sets: SetDef[] }): string {
	const date = new Date().toISOString().slice(0, 10);
	const dir = resolve(ROOT, "results", meta.label ? `${date}-${meta.label}` : date);
	mkdirSync(dir, { recursive: true });

	const all = records.map(score);
	const engines = [...new Set(all.map((r) => r.engine))];
	const label = (e: string) => all.find((r) => r.engine === e)?.engineLabel ?? e;
	const setIds = meta.sets.map((s) => s.id).filter((id) => all.some((r) => r.clip.set === id));
	const speakerOf = (r: Scored) => r.clip.speaker || `clip:${r.clip.id}`;
	const langOf = (id: string) => meta.sets.find((s) => s.id === id)?.language ?? "";
	// An engine with no option for a set's language gets no language hint and auto-detects,
	// so its score there is what a user choosing that language gets, not the model's
	// accuracy with the language set. Marked with * and left out of paired comparisons.
	const unsupported = (id: string, e: string) => {
		const a = ENGINES.find((x) => x.id === e);
		return !!a && meta.options.language !== "auto" && !a.supportsLanguage(langOf(id));
	};
	const star = (id: string, e: string, v: string) => (unsupported(id, e) ? `${v} *` : v);
	const flagged: string[] = [];

	const agg: Record<string, Record<string, unknown>> = {};
	const lines: string[] = [];
	// Self-hosted deployment ids are internal; reports name the host only. The cache keeps the real id.
	const publicModel = (m: string) => (m.startsWith("baseten:") ? "self-hosted (Baseten)" : m);
	const models = Object.fromEntries(engines.map((e) => [e, [...new Set(all.filter((r) => r.engine === e).map((r) => publicModel(r.model)))].join(", ")]));

	lines.push(`# ASR benchmark results — ${date}${meta.label ? ` (${meta.label})` : ""}`, "");
	lines.push(`Options: ${Object.entries(meta.options).map(([k, v]) => `${k}=${v}`).join(", ")}`, "");
	lines.push("| Engine | Model |", "|---|---|", ...engines.map((e) => `| ${label(e)} | ${models[e]} |`), "");

	// Test sets
	lines.push("## Test sets", "", "| Set | Language | Condition | Clips | Minutes | Speakers |", "|---|---|---|---|---|---|");
	for (const id of setIds) {
		const s = meta.sets.find((x) => x.id === id)!;
		const cs = [...new Map(all.filter((r) => r.clip.set === id).map((r) => [r.clip.id, r.clip])).values()];
		const spk = new Set(cs.map((c) => c.speaker).filter(Boolean)).size;
		const min = cs.reduce((a, c) => a + Number(c.duration_sec), 0) / 60;
		lines.push(`| ${id} | ${s.language} | ${s.condition} | ${cs.length} | ${min.toFixed(1)} | ${spk || "not labelled"} |`);
	}
	lines.push("");

	const speechSets = setIds.filter((id) => all.some((r) => r.clip.set === id && r.clip.reference.trim()));
	const nonSpeechSets = setIds.filter((id) => !speechSets.includes(id));
	const cell = (id: string, e: string) => all.filter((r) => r.clip.set === id && r.engine === e && r.run === 0 && r.scores);

	// Accuracy
	lines.push("## Accuracy (normalized error rate, lower is better)", "", "95% intervals from bootstrap resampling by speaker. Chinese uses Mixed Error Rate.", "");
	lines.push(`| Set | ${engines.map(label).join(" | ")} |`, `|---|${engines.map(() => "---|").join("")}`);
	for (const id of speechSets) {
		const row = engines.map((e) => {
			const xs = cell(id, e);
			if (!xs.length) return "–";
			const i = bootstrapRate(xs, speakerOf, (r) => r.scores!.headline);
			(agg[`${id}/${e}`] ??= {}).headline = i;
			if (unsupported(id, e)) {
				agg[`${id}/${e}`].languageNotSupported = true;
				flagged.push(`${label(e)} on ${id}`);
			}
			return star(id, e, iv(i));
		});
		lines.push(`| ${id} | ${row.join(" | ")} |`);
	}
	lines.push("");
	if (flagged.length) {
		lines.push(`\\* No option for this language in the engine, so no language was sent and the engine auto-detected: ${flagged.join("; ")}. This is what a person choosing that language gets, not the engine's accuracy with the language set. Left out of paired comparisons.`, "");
	}

	// Formatted accuracy
	lines.push("## Formatted accuracy (case and punctuation counted)", "", `| Set | ${engines.map(label).join(" | ")} |`, `|---|${engines.map(() => "---|").join("")}`);
	for (const id of speechSets) {
		const row = engines.map((e) => {
			const xs = cell(id, e);
			if (!xs.length) return "–";
			const v = rate(xs.map((r) => r.scores!.formatted));
			(agg[`${id}/${e}`] ??= {}).formatted = v;
			return star(id, e, pct(v));
		});
		lines.push(`| ${id} | ${row.join(" | ")} |`);
	}
	lines.push("");

	// Error types
	lines.push("## Error types (share of reference words, all speech sets)", "", "| Engine | Substitutions | Deletions | Insertions |", "|---|---|---|---|");
	for (const e of engines) {
		const t = sumScores(all.filter((r) => r.engine === e && r.run === 0 && r.scores).map((r) => r.scores!.headline));
		if (t.refLen) lines.push(`| ${label(e)} | ${pct(t.sub / t.refLen)} | ${pct(t.del / t.refLen)} | ${pct(t.ins / t.refLen)} |`);
	}
	lines.push("");

	// Non-speech
	if (nonSpeechSets.length) {
		lines.push("## Output on non-speech audio (lower is better)", "", "Share of silence or noise-only clips where the engine returned any text.", "");
		lines.push(`| Set | ${engines.map(label).join(" | ")} |`, `|---|${engines.map(() => "---|").join("")}`);
		for (const id of nonSpeechSets) {
			const row = engines.map((e) => {
				const xs = all.filter((r) => r.clip.set === id && r.engine === e && r.run === 0 && !r.failed);
				if (!xs.length) return "–";
				const n = xs.filter((r) => !r.dropped && r.result.text.trim()).length;
				(agg[`${id}/${e}`] ??= {}).nonSpeechOutputRate = n / xs.length;
				return `${pct(n / xs.length)} (${n}/${xs.length})`;
			});
			lines.push(`| ${id} | ${row.join(" | ")} |`);
		}
		lines.push("");
	}

	// Latency
	lines.push("## Latency (ms, every run)", "", "Wait = end of audio to final transcript. Connect = time to open a session.", "");
	lines.push("| Engine | Wait median | Wait p90 | Connect median | Connect p90 | Runs |", "|---|---|---|---|---|---|");
	for (const e of engines) {
		const ok = all.filter((r) => r.engine === e && !r.result.error);
		const w = ok.map((r) => r.result.latencyMs), c = ok.map((r) => r.result.connectMs);
		(agg[`latency/${e}`] = { waitP50: percentile(w, 0.5), waitP90: percentile(w, 0.9), connectP50: percentile(c, 0.5), connectP90: percentile(c, 0.9), n: ok.length });
		lines.push(`| ${label(e)} | ${percentile(w, 0.5)} | ${percentile(w, 0.9)} | ${percentile(c, 0.5)} | ${percentile(c, 0.9)} | ${ok.length} |`);
	}
	lines.push("");

	// Failures
	lines.push("## Failures", "", "| Engine | Dropped by client gate | Connection or timeout failures |", "|---|---|---|");
	for (const e of engines) {
		const xs = all.filter((r) => r.engine === e && r.run === 0);
		const d = xs.filter((r) => r.dropped), f = xs.filter((r) => r.failed);
		agg[`failures/${e}`] = { clips: xs.length, dropped: d.length, failed: f.length, droppedSets: d.map((r) => r.clip.set) };
		const ids = (rs: Scored[]) => (rs.length ? ` (${rs.map((r) => r.clip.set).join(", ")})` : "");
		lines.push(`| ${label(e)} | ${d.length}${ids(d)} | ${f.length}${ids(f)} |`);
	}
	lines.push("");

	// Paired comparisons
	lines.push("## Paired comparisons", "", "Each set's most accurate engine against each other engine, on the same clips. Difference = other minus best.", "");
	lines.push("| Set | Best | Other | Difference [95% interval] | p |", "|---|---|---|---|---|");
	for (const id of speechSets) {
		const ranked = engines.filter((e) => cell(id, e).length && !unsupported(id, e)).sort((a, b) => rate(cell(id, a).map((r) => r.scores!.headline)) - rate(cell(id, b).map((r) => r.scores!.headline)));
		const best = ranked[0];
		for (const other of ranked.slice(1)) {
			const byClip = new Map(cell(id, best).map((r) => [r.clip.id, r]));
			const pairs = cell(id, other).filter((r) => byClip.has(r.clip.id)).map((r) => ({ a: r, b: byClip.get(r.clip.id)! }));
			if (pairs.length < 2) continue;
			const pr = pairedBootstrap(pairs, (p) => speakerOf(p.a), (p) => p.a.scores!.headline, (p) => p.b.scores!.headline);
			lines.push(`| ${id} | ${label(best)} | ${label(other)} | +${pct(pr.diff)} [${pct(pr.lo)}–${pct(pr.hi)}] | ${pr.p < 0.001 ? "<0.001" : pr.p.toFixed(3)} |`);
		}
	}
	lines.push("");
	lines.push("Sets without speaker labels are resampled by clip, which makes their intervals too narrow. Add a `speaker` column to transcripts.tsv to fix this.", "");

	writeFileSync(resolve(dir, "summary.md"), lines.join("\n").replace(/<small>|<\/small>/g, ""));
	const labels = Object.fromEntries(engines.map((e) => [e, label(e)]));
	const runDates = [...new Set(all.map((r) => (r.result as { at?: string }).at?.slice(0, 10)).filter(Boolean))].sort();
	writeFileSync(resolve(dir, "results.json"), JSON.stringify({ date, runDates, ...meta, sets: meta.sets.filter((s) => setIds.includes(s.id)), models, labels, aggregates: agg }, null, 2));

	const rows = all.map((r) => ({
		set: r.clip.set, clip: r.clip.id, engine: r.engine, run: String(r.run), reference: r.clip.reference, transcript: r.result.text,
		errors: r.scores ? String(r.scores.headline.errors) : "", ref_tokens: r.scores ? String(r.scores.headline.refLen) : "",
		latency_ms: String(r.result.latencyMs), error: r.result.error ?? "",
		first_final_ms: r.result.firstFinalMs != null ? String(r.result.firstFinalMs) : "",
		first_final_before_end: r.result.firstFinalBeforeEnd != null ? String(r.result.firstFinalBeforeEnd) : "",
		audio_ms: r.result.audioMs != null ? String(Math.round(r.result.audioMs)) : "",
	}));
	const local = resolve(ROOT, "cache", "clips");
	mkdirSync(local, { recursive: true });
	writeFileSync(resolve(local, `${dir.split("/").pop()}.tsv`), writeTsv(rows, ["set", "clip", "engine", "run", "reference", "transcript", "errors", "ref_tokens", "latency_ms", "error", "first_final_ms", "first_final_before_end", "audio_ms"]));
	return dir;
}
