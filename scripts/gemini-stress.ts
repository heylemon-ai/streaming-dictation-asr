/**
 * Gemini vs Gemini Smart: latency consistency and load.
 *
 *   npx tsx scripts/gemini-stress.ts repeat [--rounds 20] [--clips id,id,...]
 *     Plays the same clips again and again. Each round starts one Gemini and one Gemini Smart
 *     session at the same moment on the same clip, so both see the same network and service load.
 *
 *   npx tsx scripts/gemini-stress.ts stress [--levels 1,5,10,25,50] [--engines gemini-smart,gemini]
 *     For each level C, runs max(2C, 10) sessions with C open at once, cycling through English
 *     dictation clips. No retries: rate limits and failures are recorded as they happen.
 *
 * Raw sessions go to results/<date>-gemini-<mode>[-<label>]/sessions.json, a summary to summary.md.
 * --label names the run (e.g. the time of day), so several runs on one day are kept.
 * Only aggregates and clip ids are written; no transcripts.
 */

import { config } from "dotenv";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { readWav } from "../src/audio/wav";
import { ENGINES, shaperFor } from "../src/engines";
import { transcribe } from "../src/engines/harness";
import { DATA_DIR, readManifest, type Clip } from "../src/manifest";
import { loadProfile, ROOT } from "../src/profile";
import { scoreClip } from "../src/score";

config({ path: resolve(ROOT, ".env"), quiet: true });

const arg = (n: string) => {
	const i = process.argv.indexOf(`--${n}`);
	return i >= 0 ? process.argv[i + 1] : undefined;
};
const mode = process.argv[2];
if (mode !== "repeat" && mode !== "stress") throw new Error("Usage: gemini-stress.ts repeat|stress [options]");

type Session = {
	engine: string; clip: string; round?: number; level?: number;
	startedAt: string; connectMs: number; latencyMs: number; error?: string; wer?: number; textHash?: string;
};

const profile = loadProfile();
const clipsAll = readManifest();
const byId = new Map(clipsAll.map((c) => [c.id, c]));
const engine = (id: string) => {
	const e = ENGINES.find((x) => x.id === id);
	if (!e) throw new Error(`Unknown engine ${id}`);
	return e;
};
const hash = (s: string) => {
	let h = 0;
	for (const ch of s) h = (h * 31 + ch.charCodeAt(0)) | 0;
	return (h >>> 0).toString(16);
};

async function play(engineId: string, clip: Clip): Promise<Session> {
	const e = engine(engineId);
	const { shaper, sampleRate } = await shaperFor(e.id, profile, true);
	const startedAt = new Date().toISOString();
	const r = await transcribe(e, shaper, readWav(resolve(DATA_DIR, clip.file)), {
		language: clip.language,
		speed: 1,
		feedSamples: profile.feed.samples,
		feedIntervalMs: profile.feed.intervalMs,
		sampleRate,
	});
	const s: Session = { engine: e.id, clip: clip.id, startedAt, connectMs: r.connectMs, latencyMs: r.latencyMs, error: r.error };
	if (!r.error) {
		const h = scoreClip(clip.reference, r.text, clip.language).headline;
		s.wer = +((h.errors / Math.max(1, h.refLen)) * 100).toFixed(1);
		s.textHash = hash(r.text.trim());
	}
	return s;
}

const q = (xs: number[], p: number) => {
	const s = [...xs].sort((a, b) => a - b);
	return s.length ? s[Math.min(s.length - 1, Math.floor(p * (s.length - 1) + 0.5))] : NaN;
};
const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
const sd = (xs: number[]) => Math.sqrt(mean(xs.map((x) => (x - mean(xs)) ** 2)));
const stats = (ss: Session[]) => {
	const ok = ss.filter((s) => !s.error);
	const w = ok.map((s) => s.latencyMs), c = ok.map((s) => s.connectMs);
	const hashes = new Map<string, number>();
	ok.forEach((s) => hashes.set(s.textHash!, (hashes.get(s.textHash!) ?? 0) + 1));
	return {
		n: ss.length, failed: ss.length - ok.length,
		waitP50: q(w, 0.5), waitP90: q(w, 0.9), waitMin: Math.min(...w), waitMax: Math.max(...w), waitSd: Math.round(sd(w)),
		connectP50: q(c, 0.5), connectP90: q(c, 0.9),
		wer: ok.length ? +mean(ok.map((s) => s.wer!)).toFixed(1) : NaN,
		sameText: ok.length ? Math.round((Math.max(...hashes.values()) / ok.length) * 100) : NaN,
		errors: [...new Set(ss.filter((s) => s.error).map((s) => s.error!.slice(0, 80)))],
	};
};

async function main() {
	// --label keeps several runs on one day apart (e.g. by time of day); without it, a rerun replaces the day's folder.
	const label = arg("label");
	const out = resolve(ROOT, "results", `${new Date().toISOString().slice(0, 10)}-gemini-${mode}${label ? `-${label}` : ""}`);
	mkdirSync(out, { recursive: true });
	const sessions: Session[] = [];
	const save = () => writeFileSync(resolve(out, "sessions.json"), JSON.stringify(sessions, null, 1));
	const lines: string[] = [];

	if (mode === "repeat") {
		const rounds = Number(arg("rounds") ?? 20);
		const ids = (arg("clips") ?? "en-dictation/048-google-docs,en-dictation/090-claude-chat,en-dictation/028-slack").split(",");
		const engines = ["gemini", "gemini-smart"];
		for (let r = 0; r < rounds; r++) {
			for (const id of ids) {
				const clip = byId.get(id);
				if (!clip) throw new Error(`Unknown clip ${id}`);
				const pair = await Promise.all(engines.map((e) => play(e, clip)));
				pair.forEach((s) => sessions.push({ ...s, round: r }));
				console.log(`  round ${r + 1}/${rounds} ${id}: ${pair.map((s) => `${s.engine} ${s.error ? "✗ " + s.error.slice(0, 60) : s.latencyMs + " ms"}`).join(" · ")}`);
				save();
				await new Promise((ok) => setTimeout(ok, 1000));
			}
		}
		lines.push(`# Gemini vs Gemini Smart: same audio, ${rounds} rounds`, "", "Each round plays the clip on both engines at the same moment. Wait = end of audio to final text.", "");
		lines.push("| Clip | Length | Engine | Sessions | Failed | Wait p50 | Wait p90 | Min | Max | SD | Connect p50 | WER | Same text |", "|---|---|---|---|---|---|---|---|---|---|---|---|---|");
		for (const id of [...ids, "all"]) {
			for (const e of engines) {
				const ss = sessions.filter((s) => s.engine === e && (id === "all" || s.clip === id));
				const t = stats(ss);
				const len = id === "all" ? "" : `${byId.get(id)!.duration_sec} s`;
				lines.push(`| ${id === "all" ? "**All**" : id.split("/")[1]} | ${len} | ${e} | ${t.n} | ${t.failed} | ${t.waitP50} | ${t.waitP90} | ${t.waitMin} | ${t.waitMax} | ${t.waitSd} | ${t.connectP50} | ${id === "all" ? "" : t.wer + "%"} | ${id === "all" ? "" : t.sameText + "%"} |`);
			}
		}
		// Paired difference per round: Smart minus Gemini on the same clip at the same moment.
		const diffs: number[] = [];
		for (const id of ids) for (let r = 0; r < rounds; r++) {
			const a = sessions.find((s) => s.clip === id && s.round === r && s.engine === "gemini" && !s.error);
			const b = sessions.find((s) => s.clip === id && s.round === r && s.engine === "gemini-smart" && !s.error);
			if (a && b) diffs.push(b.latencyMs - a.latencyMs);
		}
		const smartFaster = diffs.filter((d) => d < 0).length;
		lines.push("", `Paired (same clip, same moment), ${diffs.length} pairs: Smart minus Gemini median ${q(diffs, 0.5)} ms (p10 ${q(diffs, 0.1)}, p90 ${q(diffs, 0.9)}); Smart faster in ${smartFaster} of ${diffs.length}.`);
	} else {
		const levels = (arg("levels") ?? "1,5,10,25,50").split(",").map(Number);
		const engines = (arg("engines") ?? "gemini-smart,gemini").split(",");
		const pool = clipsAll.filter((c) => c.set === "en-dictation" && Number(c.duration_sec) <= 40);
		lines.push("# Gemini load test", "", "Each level runs max(2C, 10) sessions with C open at once. No retries.", "");
		lines.push("| Engine | Open at once | Sessions | Failed | Wait p50 | Wait p90 | Max | Connect p50 | Connect p90 | WER | Errors |", "|---|---|---|---|---|---|---|---|---|---|---|");
		for (const level of levels) {
			for (const e of engines) {
				const total = Math.max(2 * level, 10);
				let next = 0;
				const mine: Session[] = [];
				const t0 = Date.now();
				const worker = async () => {
					while (next < total) {
						const i = next++;
						const s = await play(e, pool[i % pool.length]);
						mine.push({ ...s, level });
					}
				};
				await Promise.all(Array.from({ length: level }, worker));
				sessions.push(...mine);
				save();
				const t = stats(mine);
				console.log(`  ${e} ×${level}: ${t.n} sessions, ${t.failed} failed, wait p50 ${t.waitP50} p90 ${t.waitP90}, ${Math.round((Date.now() - t0) / 1000)} s ${t.errors.join("; ")}`);
				lines.push(`| ${e} | ${level} | ${t.n} | ${t.failed} | ${t.waitP50} | ${t.waitP90} | ${t.waitMax} | ${t.connectP50} | ${t.connectP90} | ${t.wer}% | ${t.errors.join("; ") || "–"} |`);
				await new Promise((ok) => setTimeout(ok, 5000));
			}
		}
	}
	writeFileSync(resolve(out, "summary.md"), lines.join("\n") + "\n");
	console.log("\n" + lines.join("\n") + `\n\n  ${out}`);
}

main().catch((e) => {
	console.error(e instanceof Error ? e.message : e);
	process.exit(1);
});
