/**
 * English WER against the word-for-word references (what the reader actually said) as well as the scripts.
 *
 *   npx tsx paper/analysis/verbatim.ts > paper/analysis/verbatim.json
 *
 * References come from data/verbatim/draft.json and data/verbatim/decisions.json (tools/verbatim/: a draft from the
 * systems' agreement, confirmed by a person). Only recordings marked reviewed are used. Transcripts are the main
 * run's (cache/clips/2026-10-21-main.tsv) plus gated Whisper and the other Whisper setups from the Whisper-family
 * run (cache/clips/2026-10-21-whisper-family.tsv). Clips the client VAD never sent count as empty transcripts, as in
 * the paper. Intervals: percentile bootstrap over clips (one speaker), 2,000 resamples, paired for differences.
 * Only aggregates are written.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { align, scoreClip, tokens, type Score } from "../../src/score";

const ROOT = resolve(import.meta.dirname, "../..");
type Draft = { clips: { id: string; set: string; script: string[]; proposals: { type: string; at: number; words: string; proposed: boolean }[] }[] };
type Decision = { accepted: Record<string, boolean>; override: string | null; reviewed: boolean };
const draft: Draft = JSON.parse(readFileSync(resolve(ROOT, "data/verbatim/draft.json"), "utf-8"));
const decisions: Record<string, Decision> = JSON.parse(readFileSync(process.env.VERBATIM_DECISIONS ?? resolve(ROOT, "data/verbatim/decisions.json"), "utf-8"));

/** The same composition as the review page: the script with the accepted edits applied. */
function compose(c: Draft["clips"][number], d: Decision): string {
	if (d.override != null) return d.override;
	const ins: Record<number, string[]> = {}, at: Record<number, Draft["clips"][number]["proposals"][number]> = {};
	c.proposals.forEach((p, i) => { if (!d.accepted[i]) return; if (p.type === "ins") (ins[p.at] ??= []).push(p.words); else at[p.at] = p; });
	const out: string[] = [];
	for (let k = 0; k <= c.script.length; k++) {
		out.push(...(ins[k] ?? []));
		if (k === c.script.length) break;
		const p = at[k];
		if (p?.type === "del") continue;
		out.push(p?.type === "sub" ? p.words : c.script[k]);
	}
	return out.join(" ");
}

const verbatim = new Map<string, { set: string; script: string; said: string }>();
for (const c of draft.clips) {
	const d = decisions[c.id];
	if (d?.reviewed) verbatim.set(c.id, { set: c.set, script: c.script.join(" "), said: compose(c, d) });
}

// How far the references moved: word edits from script to what was said (normalised words).
const moved = { clips: 0, scriptWords: 0, edits: 0, ins: 0, del: 0, sub: 0, overrides: 0 };
for (const [id, v] of verbatim) {
	const a = align(tokens(v.script, "en", "wer"), tokens(v.said, "en", "wer"));
	moved.scriptWords += a.refLen; moved.edits += a.errors; moved.ins += a.ins; moved.del += a.del; moved.sub += a.sub;
	if (a.errors) moved.clips++;
	if (decisions[id].override != null) moved.overrides++;
}

function readTsv(path: string) {
	const [head, ...lines] = readFileSync(resolve(ROOT, path), "utf-8").split("\n").filter(Boolean);
	const cols = head.split("\t");
	return lines.map((l) => Object.fromEntries(l.split("\t").map((v, i) => [cols[i], v])));
}
const main = readTsv("cache/clips/2026-10-21-main.tsv");
const mainEngines = new Set(main.map((r) => r.engine));
const family = readTsv("cache/clips/2026-10-21-whisper-family.tsv").filter((r) => !mainEngines.has(r.engine));

type Row = { script: Score; said: Score };
const clips: Record<string, Record<string, Record<string, Row>>> = {}; // engine -> set -> clip -> scores
for (const r of [...main, ...family]) {
	const v = verbatim.get(r.clip);
	if (!v || r.run !== "0" || (r.error && !r.error.startsWith("dropped"))) continue;
	const hyp = r.error ? "" : r.transcript;
	((clips[r.engine] ??= {})[v.set] ??= {})[r.clip] = { script: scoreClip(v.script, hyp, "en").headline, said: scoreClip(v.said, hyp, "en").headline };
}

let seed = 11;
// mulberry32: a full-period 32-bit generator (the earlier LCG lost precision in floating point and cycled after about 14,000 draws).
const rnd = () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const pct = (xs: Score[], k: keyof Score = "errors") => (100 * xs.reduce((a, s) => a + (s[k] as number), 0)) / Math.max(1, xs.reduce((a, s) => a + s.refLen, 0));
const r1 = (x: number) => +x.toFixed(1);
function summarise(rows: Row[]) {
	const said = rows.map((r) => r.said), script = rows.map((r) => r.script);
	const boot: number[] = [], diff: number[] = [];
	for (let b = 0; b < 2000; b++) {
		const pick = rows.map(() => rows[Math.floor(rnd() * rows.length)]);
		const s = pct(pick.map((r) => r.said));
		boot.push(s); diff.push(s - pct(pick.map((r) => r.script)));
	}
	boot.sort((a, b) => a - b); diff.sort((a, b) => a - b);
	return {
		clips: rows.length, script: r1(pct(script)), said: r1(pct(said)), saidCI: [r1(boot[50]), r1(boot[1949])],
		diff: r1(pct(said) - pct(script)), diffCI: [r1(diff[50]), r1(diff[1949])],
		saidSub: r1(pct(said, "sub")), saidDel: r1(pct(said, "del")), saidIns: r1(pct(said, "ins")), scriptIns: r1(pct(script, "ins")),
	};
}

const out: Record<string, Record<string, ReturnType<typeof summarise>>> = {};
for (const [e, bySet] of Object.entries(clips)) {
	for (const [set, cs] of Object.entries(bySet)) (out[set] ??= {})[e] = summarise(Object.values(cs));
	(out.all ??= {})[e] = summarise(Object.values(bySet).flatMap((cs) => Object.values(cs)));
}

// Does the order of the systems change? Spearman rank correlation, script vs said, per set.
function spearman(a: number[], b: number[]) {
	const rank = (xs: number[]) => { const o = xs.map((x, i) => [x, i]).sort((p, q) => p[0] - q[0]); const r = Array(xs.length); o.forEach(([, i], k) => (r[i] = k)); return r; };
	const ra = rank(a), rb = rank(b), n = a.length;
	return 1 - (6 * ra.reduce((s, x, i) => s + (x - rb[i]) ** 2, 0)) / (n * (n * n - 1));
}
const rankAgreement = Object.fromEntries(Object.entries(out).map(([set, es]) => {
	const v = Object.values(es);
	return [set, r1(spearman(v.map((x) => x.script), v.map((x) => x.said)) * 100) / 100];
}));

// Optional per-clip dump (local, git-ignored path) for joins with other per-clip measures, e.g. accent labels.
if (process.env.VERBATIM_CLIPS)
	writeFileSync(process.env.VERBATIM_CLIPS, JSON.stringify(Object.fromEntries(Object.entries(clips).map(([e, bySet]) =>
		[e, Object.fromEntries(Object.values(bySet).flatMap((cs) => Object.entries(cs)).map(([k, r]) => [k, { err: r.said.errors, del: r.said.del, n: r.said.refLen }]))]))));
console.log(JSON.stringify({ reviewed: verbatim.size, ofClips: draft.clips.length, moved, rankAgreement, wer: out }, null, 1));
