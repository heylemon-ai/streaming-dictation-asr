/**
 * 95% intervals for figures the paper otherwise gives as point values, from the per-clip transcripts in
 * cache/clips/ (local only). Only aggregates are written.
 *
 *   npx tsx paper/analysis/intervals.ts > paper/analysis/intervals.json
 *
 *   - names: the gap between the share of other words and of names written correctly (Table f_names), per system,
 *     and Deepgram's gap minus each other system's (paired)
 *   - mix: wrong, missing and extra words as a share of reference words, per English condition (Tables f_mix, f_whisper)
 *   - subkind: what the wrong English words are, as a share of wrong words (Table f_subkind)
 *   - cs: share of two-language recordings in which a language was lost (Table codeswitch), per test and setting
 *   - vad: gated Whisper, VAD off minus VAD on, per set (Table vad; was typed in by hand from the article analysis)
 *
 * Percentile bootstrap over clips (recordings for cs), 2,000 resamples; the English clips are one speaker, so the
 * clip is the unit. Differences are paired. The same row selection as failures.ts and make_tables.py.
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { scoreClip, tokens } from "../../src/score";

type Row = Record<string, string>;
const ROOT = resolve(import.meta.dirname, "../..");
const readTsv = (p: string): Row[] => {
	const [head, ...lines] = readFileSync(resolve(ROOT, p), "utf-8").split("\n").filter(Boolean);
	const cols = head.split("\t");
	return lines.map((l) => Object.fromEntries(l.split("\t").map((v, i) => [cols[i], v])));
};

const E7 = ["whisper-self-hosted", "qwen", "meta", "gemini", "gemini-smart", "deepgram", "assemblyai-3-6-pro", "assemblyai-3-5-pro", "zoom-scribe", "elevenlabs-scribe", "elevenlabs-scribe-clean", "openai-live-transcribe-low", "openai-realtime-whisper"];
const EN = ["en-dictation", "en-dictation-noise", "en-dictation-whisper"];

let seed = 7;
// mulberry32: a full-period 32-bit generator (the earlier LCG lost precision in floating point and cycled after about 14,000 draws).
const rnd = () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const r1 = (x: number) => +x.toFixed(1);
/** Point value and percentile interval of stat over n units resampled with replacement. */
function boot<T>(units: T[], stat: (xs: T[]) => number) {
	const b: number[] = [];
	for (let k = 0; k < 2000; k++) b.push(stat(units.map(() => units[Math.floor(rnd() * units.length)])));
	b.sort((x, y) => x - y);
	return { value: r1(stat(units)), ci: [r1(b[50]), r1(b[1949])] };
}
const sum = <T>(xs: T[], f: (x: T) => number) => xs.reduce((a, x) => a + f(x), 0);
/** The same bootstrap with its own random stream, so adding it leaves every other interval unchanged. */
let seed2 = 13;
// mulberry32: a full-period 32-bit generator (the earlier LCG lost precision in floating point and cycled after about 14,000 draws).
const rnd2 = () => { seed2 = (seed2 + 0x6d2b79f5) | 0; let t = Math.imul(seed2 ^ (seed2 >>> 15), 1 | seed2); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
function boot2<T>(units: T[], stat: (xs: T[]) => number) {
	const b: number[] = [];
	for (let k = 0; k < 2000; k++) b.push(stat(units.map(() => units[Math.floor(rnd2() * units.length)])));
	b.sort((x, y) => x - y);
	return { value: r1(stat(units)), ci: [r1(b[50]), r1(b[1949])] };
}
/** A third stream for Qwen's two-language rows, added after the others had been run. */
let seed3 = 17;
// mulberry32: a full-period 32-bit generator (the earlier LCG lost precision in floating point and cycled after about 14,000 draws).
const rnd3 = () => { seed3 = (seed3 + 0x6d2b79f5) | 0; let t = Math.imul(seed3 ^ (seed3 >>> 15), 1 | seed3); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
function boot3<T>(units: T[], stat: (xs: T[]) => number) {
	const b: number[] = [];
	for (let k = 0; k < 2000; k++) b.push(stat(units.map(() => units[Math.floor(rnd3() * units.length)])));
	b.sort((x, y) => x - y);
	return { value: r1(stat(units)), ci: [r1(b[50]), r1(b[1949])] };
}

// Word-level alignment with the reference word of each operation (as in failures.ts)
type Op = { t: "hit" | "sub" | "del" | "ins"; r?: string; h?: string };
function ops(ref: string[], hyp: string[]): Op[] {
	const m = ref.length, n = hyp.length;
	const d = Array.from({ length: m + 1 }, () => new Uint32Array(n + 1));
	for (let i = 0; i <= m; i++) d[i][0] = i;
	for (let j = 0; j <= n; j++) d[0][j] = j;
	for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j - 1] + (ref[i - 1] === hyp[j - 1] ? 0 : 1), d[i - 1][j] + 1, d[i][j - 1] + 1);
	const out: Op[] = [];
	let i = m, j = n;
	while (i > 0 || j > 0) {
		if (i > 0 && j > 0 && d[i][j] === d[i - 1][j - 1] + (ref[i - 1] === hyp[j - 1] ? 0 : 1)) { out.push({ t: ref[i - 1] === hyp[j - 1] ? "hit" : "sub", r: ref[i - 1], h: hyp[j - 1] }); i--; j--; }
		else if (i > 0 && d[i][j] === d[i - 1][j] + 1) { out.push({ t: "del", r: ref[i - 1] }); i--; }
		else { out.push({ t: "ins", h: hyp[j - 1] }); j--; }
	}
	return out.reverse();
}
const proper = (ref: string) => new Set(ref.split(/\s+/).filter((w, i, a) => i > 0 && !/[.!?:]$/.test(a[i - 1]) && /^[A-Z][a-zA-Z]+/.test(w)).map((w) => w.replace(/[^\p{L}\p{N}]/gu, "").toLowerCase()));
// Checked names (paper/analysis/names-checked.json): each capitalised word marked as a name or not by the written
// rule of Section names, plus names the capital-letter rule misses (after "Dr." or at the start of a sentence). A word counts in a
// message if it is on the list and written with a capital anywhere in that message's script.
const CHECKED_PATH = resolve(ROOT, "paper/analysis/names-checked.json");
const checked: { names: string[]; perClip: Record<string, string[]> } | null = existsSync(CHECKED_PATH) ? JSON.parse(readFileSync(CHECKED_PATH, "utf-8")) : null;
const checkedNames = (ref: string, clip: string) => {
	const caps = new Set(ref.split(/\s+/).filter((w) => /^[A-Z]/.test(w)).map((w) => w.replace(/[^\p{L}\p{N}]/gu, "").toLowerCase()));
	const ok = new Set(checked!.names);
	for (const [w, clips] of Object.entries(checked!.perClip)) if (clips.includes(clip)) ok.add(w);
	return new Set([...caps].filter((w) => ok.has(w)));
};
const SPELLED = new Set("zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty thirty forty fifty sixty seventy eighty ninety hundred thousand million first second third percent".split(" "));
const lev = (a: string, b: string) => { let p = Array.from({ length: b.length + 1 }, (_, j) => j); for (let i = 1; i <= a.length; i++) { const c = [i]; for (let j = 1; j <= b.length; j++) c[j] = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); p = c; } return p[b.length]; };

// English per-clip counts, main run (the self-hosted Whisper and the 12 other rows)
type Clip = { id: string; set: string; pR: number; pH: number; oR: number; oH: number; cR: number; cH: number; cOR: number; cOH: number; sub: number; del: number; ins: number; ref: number; kind: Record<string, number> };
const en: Record<string, Clip[]> = {};
for (const r of readTsv("cache/clips/2026-10-21-main.tsv")) {
	if (r.run !== "0" || !EN.includes(r.set) || !E7.includes(r.engine) || r.error?.startsWith("connect")) continue;
	const ref = tokens(r.reference, "en", "wer"), o = ops(ref, tokens(r.transcript ?? "", "en", "wer")), P = proper(r.reference);
	const C = checked ? checkedNames(r.reference, r.clip) : new Set<string>();
	const c: Clip = { id: `${r.set}|${r.clip}`, set: r.set, pR: 0, pH: 0, oR: 0, oH: 0, cR: 0, cH: 0, cOR: 0, cOH: 0, sub: 0, del: 0, ins: 0, ref: ref.length, kind: { number: 0, name: 0, close: 0, other: 0 } };
	for (const x of o) {
		if (x.t !== "hit") c[x.t]++;
		if (x.r) { if (P.has(x.r)) { c.pR++; if (x.t === "hit") c.pH++; } else { c.oR++; if (x.t === "hit") c.oH++; } }
		if (x.r) { if (C.has(x.r)) { c.cR++; if (x.t === "hit") c.cH++; } else { c.cOR++; if (x.t === "hit") c.cOH++; } }
		if (x.t === "sub" && x.r && x.h) {
			const num = (/^\d+$/.test(x.r) && SPELLED.has(x.h)) || (SPELLED.has(x.r) && /^\d+$/.test(x.h));
			c.kind[num ? "number" : P.has(x.r) ? "name" : x.r.length >= 4 && x.h.length >= 4 && lev(x.r, x.h) <= 2 ? "close" : "other"]++;
		}
	}
	(en[r.engine] ??= []).push(c);
}

const gap = (xs: Clip[]) => 100 * (sum(xs, (c) => c.oH) / sum(xs, (c) => c.oR) - sum(xs, (c) => c.pH) / sum(xs, (c) => c.pR));
const gapC = (xs: Clip[]) => 100 * (sum(xs, (c) => c.cOH) / sum(xs, (c) => c.cOR) - sum(xs, (c) => c.cH) / sum(xs, (c) => c.cR));
const names: Record<string, unknown> = {}, namesChecked: Record<string, unknown> = {}, mix: Record<string, unknown> = {}, subkind: Record<string, unknown> = {};
for (const e of E7) {
	const cs = en[e];
	// Paired against Deepgram (the largest gap): Deepgram's gap minus this system's, over the same clips
	const dg = new Map(en.deepgram.map((c) => [c.id, c])), ids = cs.map((c) => c.id).filter((k) => dg.has(k)), mine = new Map(cs.map((c) => [c.id, c]));
	names[e] = { clips: cs.length, names: sum(cs, (c) => c.pR), gap: boot(cs, gap),
		deepgramMinus: e === "deepgram" ? null : boot(ids, (xs) => gap(xs.map((k) => dg.get(k)!)) - gap(xs.map((k) => mine.get(k)!))) };
	if (checked) namesChecked[e] = { names: sum(cs, (c) => c.cR), namesRight: r1((100 * sum(cs, (c) => c.cH)) / sum(cs, (c) => c.cR)), otherRight: r1((100 * sum(cs, (c) => c.cOH)) / sum(cs, (c) => c.cOR)), gap: boot2(cs, gapC),
		deepgramMinus: e === "deepgram" ? null : boot2(ids, (xs) => gapC(xs.map((k) => dg.get(k)!)) - gapC(xs.map((k) => mine.get(k)!))) };
	mix[e] = Object.fromEntries(EN.map((s) => {
		const ss = cs.filter((c) => c.set === s);
		return [s, Object.fromEntries((["sub", "del", "ins"] as const).map((k) => [k, boot(ss, (xs) => (100 * sum(xs, (c) => c[k])) / sum(xs, (c) => c.ref))]))];
	}));
	subkind[e] = Object.fromEntries(["number", "name", "close", "other"].map((k) => [k, boot(cs, (xs) => (100 * sum(xs, (c) => c.kind[k])) / Math.max(1, sum(xs, (c) => c.sub)))]));
}

// Two-language recordings: a language is lost when either half is missing or replaced
const lost = (r: Row) => ["missing", "replaced"].includes(r.first_verdict) || ["missing", "replaced"].includes(r.second_verdict);
const csOut: Record<string, unknown> = {}, csAllOut: Record<string, unknown> = {};
// The recordings reuse source clips (each English message in 10 EN+X recordings), so the bootstrap resamples source
// clips and weights each recording by how often both of its clips were drawn (a pigeonhole bootstrap, Owen 2007).
const MIX_PARTS = new Map(readTsv("data/codeswitch/mixes.tsv").map((r) => [r.id, [r.first_clip, r.second_clip] as [string, string]]));
function clipBoot(recs: { id: string; y: number }[], rand: () => number) {
	const clips = [...new Set(recs.flatMap((r) => MIX_PARTS.get(r.id)!))];
	const b: number[] = [];
	for (let k = 0; k < 2000; k++) {
		const n = new Map<string, number>();
		for (let i = 0; i < clips.length; i++) { const c = clips[Math.floor(rand() * clips.length)]; n.set(c, (n.get(c) ?? 0) + 1); }
		const w = recs.map((r) => { const [x, y] = MIX_PARTS.get(r.id)!; return (n.get(x) ?? 0) * (n.get(y) ?? 0); });
		const tw = sum(w, (x) => x);
		let hit = 0;
		for (let i = 0; i < recs.length; i++) hit += w[i] * recs[i].y;
		if (tw) b.push((100 * hit) / tw);
	}
	b.sort((x, y) => x - y);
	return { value: r1((100 * sum(recs, (r) => r.y)) / recs.length), ci: [r1(b[Math.floor(0.025 * b.length)]), r1(b[Math.floor(0.975 * b.length) - 1])] };
}
for (const [path, scope] of [["cache/clips/2026-11-05-codeswitch-main.tsv", "all"], ["cache/clips/2026-11-05-codeswitch-main.tsv", "filtered"], ["cache/clips/2026-10-29-codeswitch.tsv", "filtered"]] as const) {
	const by: Record<string, { id: string; y: number }[]> = {};
	for (const r of readTsv(path)) if (scope === "all" || r.counted === "yes") (by[`${r.kind}/${r.setting}/${r.engine}`] ??= []).push({ id: r.recording, y: lost(r) ? 1 : 0 });
	const out = scope === "all" ? csAllOut : csOut;
	for (const [k, xs] of Object.entries(by)) if (!(k in out) || path.includes("10-29")) out[k] = { n: xs.length, lost: clipBoot(xs, k.endsWith("/qwen") ? rnd3 : rnd) };
}

// Gated Whisper, VAD off minus VAD on: clips the VAD never sent are empty transcripts
const gatedClips = (path: string) => {
	const m: Record<string, { set: string; errors: number; ref: number }> = {};
	for (const r of readTsv(path)) {
		if (r.engine !== "whisper" || r.run !== "0" || r.set === "nonspeech" || (r.error && !r.error.startsWith("dropped"))) continue;
		const lang = r.set.split("-")[0] === "en" ? "en" : r.set.split("-")[0];
		const s = scoreClip(r.reference, r.error ? "" : r.transcript, lang).headline;
		m[`${r.set}|${r.clip}`] = { set: r.set, errors: s.errors, ref: s.refLen };
	}
	return m;
};
const on = gatedClips("cache/clips/2026-10-21-whisper-family.tsv"), off = gatedClips("cache/clips/2026-10-13-whisper-no-vad.tsv");
const vad: Record<string, unknown> = {};
for (const s of [...EN, "ar-ae"]) {
	const ks = Object.keys(on).filter((k) => on[k].set === s && off[k]);
	const w = (m: typeof on, xs: string[]) => (100 * sum(xs, (k) => m[k].errors)) / sum(xs, (k) => m[k].ref);
	vad[s] = { clips: ks.length, on: r1(w(on, ks)), off: r1(w(off, ks)), diff: boot(ks, (xs) => w(off, xs) - w(on, xs)) };
}

console.log(JSON.stringify({ names, namesChecked, mix, subkind, cs: csOut, csAll: csAllOut, vad }, null, 1));
