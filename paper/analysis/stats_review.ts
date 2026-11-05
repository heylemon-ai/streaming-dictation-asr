/**
 * Statistics asked for in review, from the per-clip transcripts in cache/clips/ (local only). Only aggregates are
 * written. Runs paper/analysis/stats_review_ext.py for EARS and VOiCES and merges its output.
 *
 *   npx tsx paper/analysis/stats_review.ts > paper/analysis/stats_review.json
 *
 *   - tests: every comparison the paper calls clear (or whose interval it says excludes zero), with a two-sided
 *     paired-bootstrap p-value (4,000 resamples; p = 2 x the smaller share of draws on either side of zero) and a
 *     BCa interval, grouped into families; Holm's correction is applied within each family.
 *   - namesBySubset: the name gap on quiet English only and on quiet + fan-on, against all English.
 *   - saidPairs: Gemini, Gemini Smart and ElevenLabs NV compared against the word-for-word reference.
 *   - mixDiff: Whisper SH minus AAI 3.6, missing and extra words; Zoom minus GPT-Live, quiet and whispered WER.
 *   - mixSaid: wrong, missing and extra words against the word-for-word reference, every row and English set.
 *   - csFilter: two-language recordings with English, English-only minus both-languages loss rate.
 *
 * Units: clips (one speaker), recordings for two-language results, speakers for EARS and VOiCES. Same row selection
 * as intervals.ts, verbatim.ts and extras.ts.
 */
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { scoreClip, tokens, type Score } from "../../src/score";

type Row = Record<string, string>;
const ROOT = resolve(import.meta.dirname, "../..");
const readTsv = (p: string): Row[] => {
	const [head, ...lines] = readFileSync(resolve(ROOT, p), "utf-8").split("\n").filter(Boolean);
	const cols = head.split("\t");
	return lines.map((l) => Object.fromEntries(l.split("\t").map((v, i) => [cols[i], v])));
};
const E13 = ["whisper-self-hosted", "qwen", "meta", "gemini", "gemini-smart", "deepgram", "assemblyai-3-6-pro", "assemblyai-3-5-pro", "zoom-scribe", "elevenlabs-scribe", "elevenlabs-scribe-clean", "openai-live-transcribe-low", "openai-realtime-whisper"];
const EN = ["en-dictation", "en-dictation-noise", "en-dictation-whisper"];
const B = 4000;
const r1 = (x: number) => +x.toFixed(1);
const sum = <T>(xs: T[], f: (x: T) => number) => xs.reduce((a, x) => a + f(x), 0);

let seed = 17;
// mulberry32: a full-period 32-bit generator (the earlier LCG lost precision in floating point and cycled after about 14,000 draws).
const rnd = () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const ncdf = (x: number) => { // Abramowitz-Stegun 7.1.26
	const t = 1 / (1 + 0.3275911 * Math.abs(x) / Math.SQRT2), y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-(x * x) / 2);
	return x >= 0 ? (1 + y) / 2 : (1 - y) / 2;
};
const nppf = (p: number) => { let lo = -10, hi = 10; for (let k = 0; k < 100; k++) { const m = (lo + hi) / 2; if (ncdf(m) < p) lo = m; else hi = m; } return (lo + hi) / 2; };

type Test = { diff: number; ci: [number, number]; bca: [number, number]; p: number; units: number };
/** Bootstrap of stat over units: point, percentile and BCa intervals, and the two-sided p-value against `null0`. */
function test<T>(units: T[], stat: (xs: T[]) => number, null0 = 0): Test {
	const point = stat(units), n = units.length;
	const d: number[] = [];
	for (let k = 0; k < B; k++) d.push(stat(units.map(() => units[Math.floor(rnd() * n)])));
	d.sort((a, b) => a - b);
	const below = d.filter((x) => x <= null0).length, above = d.filter((x) => x >= null0).length;
	const p = Math.max(1 / (B + 1), Math.min(1, (2 * Math.min(below, above)) / B));
	const z0 = nppf(Math.min(Math.max(d.filter((x) => x < point).length / B, 1 / B), 1 - 1 / B));
	const jack = units.map((_, i) => stat(units.filter((__, j) => j !== i)));
	const jm = jack.reduce((a, x) => a + x, 0) / n;
	const num = jack.reduce((a, j) => a + (jm - j) ** 3, 0), den = 6 * jack.reduce((a, j) => a + (jm - j) ** 2, 0) ** 1.5;
	const acc = den ? num / den : 0;
	const q = (z: number) => ncdf(z0 + (z0 + z) / (1 - acc * (z0 + z)));
	const at = (u: number) => d[Math.min(B - 1, Math.max(0, Math.floor(u * B)))];
	return { diff: r1(point - null0), ci: [r1(d[Math.floor(0.025 * B)] - null0), r1(d[Math.floor(0.975 * B) - 1] - null0)], bca: [r1(at(q(-1.959964)) - null0), r1(at(q(1.959964)) - null0)], p: +p.toFixed(4), units: n };
}

// ---- In-house English, main run: per-clip scores against the script
const scoreOf = (ref: string, hyp: string, lang = "en") => scoreClip(ref, hyp, lang).headline;
const main = readTsv("cache/clips/2026-10-21-main.tsv").filter((r) => r.run === "0" && E13.includes(r.engine) && !r.error?.startsWith("connect"));
const langOf = (set: string) => (set.startsWith("en") ? "en" : set.split("-")[0]);
const byEngineSet: Record<string, Record<string, Map<string, { s: Score; r: Row }>>> = {};
for (const r of main) ((byEngineSet[r.engine] ??= {})[r.set] ??= new Map()).set(r.clip, { s: scoreOf(r.reference, r.error ? "" : r.transcript ?? "", langOf(r.set)), r });
const werOf = (xs: Score[], k: keyof Score = "errors") => (100 * sum(xs, (s) => s[k] as number)) / Math.max(1, sum(xs, (s) => s.refLen));
/** Paired over the clips both systems have in a set: rate of a minus rate of b. */
const pairedSet = (a: string, b: string, set: string, k: keyof Score = "errors", src = byEngineSet) => {
	const A = src[a][set], Bm = src[b][set], ks = [...A.keys()].filter((c) => Bm.has(c));
	return test(ks, (xs) => werOf(xs.map((c) => A.get(c)!.s), k) - werOf(xs.map((c) => Bm.get(c)!.s), k));
};

const families: Record<string, Record<string, Test & { claim: string }>> = {};
const add = (fam: string, name: string, claim: string, t: Test) => ((families[fam] ??= {})[name] = { claim, ...t });

// Table overall: the lowest row against the next, each English column (the paper bolds only quiet WER)
for (const set of EN) {
	const ranked = [...E13].sort((a, b) => werOf([...byEngineSet[a][set].values()].map((x) => x.s)) - werOf([...byEngineSet[b][set].values()].map((x) => x.s)));
	add("bestVsNext", `${set}: ${ranked[0]} - ${ranked[1]}`, set === "en-dictation" ? "clear (bold in Table overall)" : "not clear", pairedSet(ranked[0], ranked[1], set));
}

// Whispered: the four systems that leave out words, missing-word share against the 3% of the other group
for (const e of ["qwen", "zoom-scribe", "assemblyai-3-6-pro", "assemblyai-3-5-pro"]) {
	const xs = [...byEngineSet[e]["en-dictation-whisper"].values()].map((x) => x.s);
	add("whisperMissingVs3", e, "interval lies above 3%", test(xs, (ys) => werOf(ys, "del"), 3));
}

// Name gaps (checked names, as in Table f_names): other words right minus names right, per system; Deepgram minus others
const checked: { names: string[]; perClip: Record<string, string[]> } = JSON.parse(readFileSync(resolve(ROOT, "paper/analysis/names-checked.json"), "utf-8"));
type NC = { set: string; id: string; cR: number; cH: number; oR: number; oH: number };
function nameCounts(r: Row): NC {
	const caps = new Set(r.reference.split(/\s+/).filter((w) => /^[A-Z]/.test(w)).map((w) => w.replace(/[^\p{L}\p{N}]/gu, "").toLowerCase()));
	const ok = new Set(checked.names);
	for (const [w, clips] of Object.entries(checked.perClip)) if (clips.includes(r.clip)) ok.add(w);
	const C = new Set([...caps].filter((w) => ok.has(w)));
	const ref = tokens(r.reference, "en", "wer"), hyp = tokens(r.error ? "" : r.transcript ?? "", "en", "wer");
	const m = ref.length, n = hyp.length, d = Array.from({ length: m + 1 }, () => new Uint32Array(n + 1));
	for (let i = 0; i <= m; i++) d[i][0] = i;
	for (let j = 0; j <= n; j++) d[0][j] = j;
	for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j - 1] + (ref[i - 1] === hyp[j - 1] ? 0 : 1), d[i - 1][j] + 1, d[i][j - 1] + 1);
	const c: NC = { set: r.set, id: `${r.set}|${r.clip}`, cR: 0, cH: 0, oR: 0, oH: 0 };
	let i = m, j = n;
	while (i > 0 || j > 0) { // the same traceback as intervals.ts
		if (i > 0 && j > 0 && d[i][j] === d[i - 1][j - 1] + (ref[i - 1] === hyp[j - 1] ? 0 : 1)) { const hit = ref[i - 1] === hyp[j - 1]; if (C.has(ref[i - 1])) { c.cR++; if (hit) c.cH++; } else { c.oR++; if (hit) c.oH++; } i--; j--; }
		else if (i > 0 && d[i][j] === d[i - 1][j] + 1) { if (C.has(ref[i - 1])) c.cR++; else c.oR++; i--; }
		else j--;
	}
	return c;
}
const nc: Record<string, NC[]> = {};
for (const r of main) if (EN.includes(r.set)) (nc[r.engine] ??= []).push(nameCounts(r));
const gap = (xs: NC[]) => 100 * (sum(xs, (c) => c.oH) / sum(xs, (c) => c.oR) - sum(xs, (c) => c.cH) / sum(xs, (c) => c.cR));
const namesBySubset: Record<string, Record<string, Test & { names: number }>> = {};
const SUBSETS: Record<string, string[]> = { all: EN, quiet: ["en-dictation"], quietAndFan: ["en-dictation", "en-dictation-noise"] };
for (const e of E13) {
	for (const [sub, sets] of Object.entries(SUBSETS)) {
		const xs = nc[e].filter((c) => sets.includes(c.set));
		(namesBySubset[sub] ??= {})[e] = { names: sum(xs, (c) => c.cR), ...test(xs, gap) };
	}
	add("nameGaps", e, "gap interval excludes zero (Table f_names)", namesBySubset.all[e]);
	if (e !== "deepgram") {
		const dg = new Map(nc.deepgram.map((c) => [c.id, c])), mine = new Map(nc[e].map((c) => [c.id, c]));
		const ids = [...mine.keys()].filter((k) => dg.has(k));
		add("deepgramNameGapMinusOthers", e, "Deepgram's gap clearly larger for 6 systems", test(ids, (xs) => gap(xs.map((k) => dg.get(k)!)) - gap(xs.map((k) => mine.get(k)!))));
	}
}

// ---- Against the word-for-word reference (the same composition as verbatim.ts)
type Draft = { clips: { id: string; set: string; script: string[]; proposals: { type: string; at: number; words: string }[] }[] };
type Decision = { accepted: Record<string, boolean>; override: string | null; reviewed: boolean };
const draft: Draft = JSON.parse(readFileSync(resolve(ROOT, "data/verbatim/draft.json"), "utf-8"));
const decisions: Record<string, Decision> = JSON.parse(readFileSync(resolve(ROOT, "data/verbatim/decisions.json"), "utf-8"));
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
const said = new Map<string, string>();
for (const c of draft.clips) if (decisions[c.id]?.reviewed) said.set(c.id, compose(c, decisions[c.id]));
const saidES: typeof byEngineSet = {};
const scriptES: typeof byEngineSet = {};
for (const r of main) {
	if (!EN.includes(r.set) || !said.has(r.clip)) continue;
	const hyp = r.error ? "" : r.transcript ?? "";
	((saidES[r.engine] ??= {})[r.set] ??= new Map()).set(r.clip, { s: scoreOf(said.get(r.clip)!, hyp), r });
	((scriptES[r.engine] ??= {})[r.set] ??= new Map()).set(r.clip, { s: scoreOf(r.reference, hyp), r });
}
const q = "en-dictation";
const saidPairs = {
	"gemini - gemini-smart": pairedSet("gemini", "gemini-smart", q, "errors", saidES),
	"elevenlabs-scribe-clean - gemini": pairedSet("elevenlabs-scribe-clean", "gemini", q, "errors", saidES),
	"gemini-smart - elevenlabs-scribe-clean": pairedSet("gemini-smart", "elevenlabs-scribe-clean", q, "errors", saidES),
	"script: gemini-smart - elevenlabs-scribe-clean": pairedSet("gemini-smart", "elevenlabs-scribe-clean", q, "errors", scriptES),
};
// Said minus script, per row and set (paired over clips)
const saidMinusScript: Record<string, Record<string, Test>> = {};
for (const e of E13) for (const set of EN) {
	const A = saidES[e][set], S = scriptES[e][set], ks = [...A.keys()];
	(saidMinusScript[set] ??= {})[e] = test(ks, (xs) => werOf(xs.map((c) => A.get(c)!.s)) - werOf(xs.map((c) => S.get(c)!.s)));
}
add("saidVsScript", "gemini-smart quiet", "the only system that does not improve (+0.8, CI includes zero)", saidMinusScript[q]["gemini-smart"]);
add("saidVsScript", "elevenlabs-scribe-clean quiet", "improvement within chance", saidMinusScript[q]["elevenlabs-scribe-clean"]);
for (const e of E13.filter((x) => !["gemini-smart", "elevenlabs-scribe-clean"].includes(x))) add("saidVsScript", `${e} quiet`, "every verbatim system does better on quiet English by 2.2-4.0", saidMinusScript[q][e]);
add("saidPairs", "gemini - gemini-smart (said)", "Gemini below Gemini Smart against what was said", saidPairs["gemini - gemini-smart"]);

const mixSaid: Record<string, Record<string, Record<string, number>>> = {};
for (const e of E13) for (const set of EN) {
	const xs = [...saidES[e][set].values()].map((x) => x.s), ys = [...scriptES[e][set].values()].map((x) => x.s);
	(mixSaid[set] ??= {})[e] = { wer: r1(werOf(xs)), sub: r1(werOf(xs, "sub")), del: r1(werOf(xs, "del")), ins: r1(werOf(xs, "ins")), scriptSub: r1(werOf(ys, "sub")), scriptDel: r1(werOf(ys, "del")), scriptIns: r1(werOf(ys, "ins")) };
}

// ---- Same WER, different mix
const mixDiff = {
	"whisper-self-hosted - assemblyai-3-6-pro quiet WER": pairedSet("whisper-self-hosted", "assemblyai-3-6-pro", q),
	"whisper-self-hosted - assemblyai-3-6-pro quiet missing": pairedSet("whisper-self-hosted", "assemblyai-3-6-pro", q, "del"),
	"whisper-self-hosted - assemblyai-3-6-pro quiet extra": pairedSet("whisper-self-hosted", "assemblyai-3-6-pro", q, "ins"),
	"zoom-scribe - openai-live-transcribe-low quiet WER": pairedSet("zoom-scribe", "openai-live-transcribe-low", q),
	"zoom-scribe - openai-live-transcribe-low whispered WER": pairedSet("zoom-scribe", "openai-live-transcribe-low", "en-dictation-whisper"),
	"zoom-scribe - openai-live-transcribe-low whispered missing": pairedSet("zoom-scribe", "openai-live-transcribe-low", "en-dictation-whisper", "del"),
};
add("mixPairs", "whisper-self-hosted - aai-3.6 missing (quiet)", "Whisper SH misses more words (2.2 vs 1.3)", mixDiff["whisper-self-hosted - assemblyai-3-6-pro quiet missing"]);
add("mixPairs", "whisper-self-hosted - aai-3.6 extra (quiet)", "Whisper SH adds fewer words (2.9 vs 4.0)", mixDiff["whisper-self-hosted - assemblyai-3-6-pro quiet extra"]);

// ElevenLabs NV minus ElevenLabs on the two Arabic dialects
const nvArabic = { "ar-sa": pairedSet("elevenlabs-scribe-clean", "elevenlabs-scribe", "ar-sa"), "ar-ae": pairedSet("elevenlabs-scribe-clean", "elevenlabs-scribe", "ar-ae") };
for (const [s, t] of Object.entries(nvArabic)) add("nvArabic", s, "ElevenLabs NV much worse on the Arabic dialects", t);

// ---- Whisper setups on in-house clips (Table vad and Section whisperguide)
const famClips = (path: string, engine: string) => {
	const m = new Map<string, Score>();
	for (const r of readTsv(path)) {
		if (r.engine !== engine || r.run !== "0" || r.set === "nonspeech" || (r.error && !r.error.startsWith("dropped"))) continue;
		m.set(`${r.set}|${r.clip}`, scoreOf(r.reference, r.error ? "" : r.transcript, langOf(r.set)));
	}
	return m;
};
const FAM = "cache/clips/2026-10-21-whisper-family.tsv";
const gOn = famClips(FAM, "whisper"), gOff = famClips("cache/clips/2026-10-13-whisper-no-vad.tsv", "whisper");
const sh = famClips(FAM, "whisper-self-hosted"), shVad = famClips(FAM, "whisper-self-hosted-vad"), ten = famClips(FAM, "whisper-self-hosted-ten"), tenVad = famClips(FAM, "whisper-self-hosted-ten-vad");
const pairM = (a: Map<string, Score>, b: Map<string, Score>, set: string, k: keyof Score = "errors") => {
	const ks = [...a.keys()].filter((c) => c.startsWith(`${set}|`) && b.has(c));
	return test(ks, (xs) => werOf(xs.map((c) => a.get(c)!), k) - werOf(xs.map((c) => b.get(c)!), k));
};
for (const set of [...EN, "ar-ae"]) add("gatedVad", `off - on ${set}`, set === "en-dictation-whisper" || set === "ar-ae" ? "clear (Table vad)" : "under a point", pairM(gOff, gOn, set));
const whisperIn = {
	"silero drops - sends all (whispered)": pairM(shVad, sh, "en-dictation-whisper"),
	"ten drops - sends all (whispered)": pairM(tenVad, sh, "en-dictation-whisper"),
	"ten drops - ten cuts (whispered)": pairM(tenVad, ten, "en-dictation-whisper"),
	"ten cuts - silero cuts (whispered)": pairM(ten, sh, "en-dictation-whisper"),
	"gated off - SH (whispered missing)": pairM(gOff, sh, "en-dictation-whisper", "del"),
};
add("whisperSetupsInHouse", "silero drops - sends all (whispered)", "10.1 -> 51.4", whisperIn["silero drops - sends all (whispered)"]);
add("whisperSetupsInHouse", "ten drops - sends all (whispered)", "TEN stays at 10.7", whisperIn["ten drops - sends all (whispered)"]);
add("whisperSetupsInHouse", "gated off - SH (whispered missing)", "Finding 2: 50% vs 1.8% missing", whisperIn["gated off - SH (whispered missing)"]);

// ---- Two-language recordings
const lostAny = (r: Row) => ["missing", "replaced"].includes(r.first_verdict) || ["missing", "replaced"].includes(r.second_verdict);
const lostOther = (r: Row) => (r.first_language === "en" ? ["missing", "replaced"].includes(r.second_verdict) : ["missing", "replaced"].includes(r.first_verdict));
const cs = readTsv("cache/clips/2026-11-05-codeswitch-main.tsv");
const cs29 = readTsv("cache/clips/2026-10-29-codeswitch.tsv");
const csBy = (rows: Row[], kind: string, setting: string, engine: string, filtered: boolean) =>
	new Map(rows.filter((r) => r.kind === kind && r.setting === setting && r.engine === engine && (!filtered || r.counted === "yes")).map((r) => [r.recording, r]));
// Each recording joins two source clips, and the clips are reused (each English message in 10 EN+X recordings, some
// clips in up to 5 X+Y), so recordings are not independent. The bootstrap resamples source clips, and each recording
// is weighted by how often both of its clips were drawn (a pigeonhole bootstrap, Owen 2007).
const MIX_PARTS = new Map(readTsv("data/codeswitch/mixes.tsv").map((r) => [r.id, [r.first_clip, r.second_clip] as [string, string]]));
function testClips(recs: string[], stat: (w: (k: string) => number) => number): Test {
	const point = stat(() => 1);
	const clips = [...new Set(recs.flatMap((k) => MIX_PARTS.get(k)!))];
	const d: number[] = [];
	for (let k = 0; k < B; k++) {
		const n = new Map<string, number>();
		for (let i = 0; i < clips.length; i++) { const c = clips[Math.floor(rnd() * clips.length)]; n.set(c, (n.get(c) ?? 0) + 1); }
		d.push(stat((r) => { const [x, y] = MIX_PARTS.get(r)!; return (n.get(x) ?? 0) * (n.get(y) ?? 0); }));
	}
	const ok = d.filter((x) => Number.isFinite(x)).sort((a, b) => a - b), m = ok.length;
	const below = ok.filter((x) => x <= 0).length, above = ok.filter((x) => x >= 0).length;
	const p = Math.max(1 / (m + 1), Math.min(1, (2 * Math.min(below, above)) / m));
	const ci: [number, number] = [r1(ok[Math.floor(0.025 * m)]), r1(ok[Math.floor(0.975 * m) - 1])];
	return { diff: r1(point), ci, bca: ci, p: +p.toFixed(4), units: recs.length };
}
const csPair = (a: Map<string, Row>, b: Map<string, Row>, f: (r: Row) => boolean) => {
	const ks = [...a.keys()].filter((k) => b.has(k));
	const share = (m: Map<string, Row>, w: (k: string) => number) => (100 * sum(ks, (k) => w(k) * +f(m.get(k)!))) / sum(ks, (k) => w(k));
	return testClips(ks, (w) => share(a, w) - share(b, w));
};
const rate = (m: Map<string, Row>, f: (r: Row) => boolean) => r1((100 * sum([...m.values()], (r) => +f(r))) / m.size);
const csFilter: Record<string, unknown> = {};
for (const e of [...new Set(cs.map((r) => r.engine))]) {
	// Qwen was run after the others: it draws from its own stream, so every other interval stays as it was.
	const saved = seed;
	if (e === "qwen") seed = 29;
	const o: Record<string, unknown> = {};
	for (const filtered of [true, false]) {
		const en = csBy(cs, "english", "en", e, filtered), both = csBy(cs, "english", "both", e, filtered);
		const lab = filtered ? "filtered" : "unfiltered";
		o[lab] = { n: en.size, englishOnlyLostOther: rate(en, lostOther), bothLostOther: rate(both, lostOther), englishOnlyLostAny: rate(en, lostAny), bothLostAny: rate(both, lostAny), englishOnlyMinusBoth: csPair(en, both, lostOther) };
	}
	// Filter: with only English selected the other language is lost in more than half of the recordings, while with
	// both selected it is lost in fewer than half (so the setting, not the system's general handling, removes it).
	// Preference: with only English selected it is still kept in more than half. Neither: lost in most either way.
	const fb = o.unfiltered as { englishOnlyLostOther: number; bothLostOther: number };
	o.class = fb.englishOnlyLostOther < 50 ? "preference" : fb.bothLostOther < 50 ? "filter" : "neither (lost in most recordings either way)";
	csFilter[e] = o;
	if (e === "qwen") seed = saved;
	add("csEnglishOnly", e, `English-only: ${o.class}`, (o.unfiltered as { englishOnlyMinusBoth: Test }).englishOnlyMinusBoth);
}
// ElevenLabs finalising at each pause against finalising once, the same 29 October run
const pause: Record<string, Test> = {};
for (const [kind, label] of [["english", "EN+X"], ["pair", "X+Y"]]) for (const e of ["elevenlabs-scribe", "elevenlabs-scribe-clean"]) {
	const t = csPair(csBy(cs29, kind, "both", `${e}-vad`, true), csBy(cs29, kind, "both", e, true), lostAny);
	pause[`${e} ${label}`] = t;
	add("elevenLabsPause", `${e} ${label}`, "finalising at each pause loses far fewer languages", t);
}

// ---- EARS and VOiCES (Python, Whisper's English normaliser)
// Python with whisper-normalizer: NORM_PYTHON if set, else the README's .venv-norm, else cache/normenv.
const PY = process.env.NORM_PYTHON ?? [".venv-norm/bin/python", "cache/normenv/bin/python"].map((p) => resolve(ROOT, p)).find((p) => existsSync(p)) ?? "";
const ext = existsSync(PY) ? JSON.parse(execFileSync(PY, ["-I", resolve(ROOT, "paper/analysis/stats_review_ext.py")], { cwd: ROOT, maxBuffer: 1 << 26 }).toString()) : null;
if (ext) {
	for (const [e, t] of Object.entries(ext.earsChange as Record<string, Test>)) add("earsWhisperedMinusNormal", e, "Table ears change", t);
	for (const [k, t] of Object.entries(ext.earsVadVsBase as Record<string, Test>)) add("earsWhisperSetups", `${k} - Silero cuts`, k === "Self-hosted, TEN drops" ? "TEN +2.9, CI includes zero" : "Table ears_vad change", t);
	add("earsWhisperSetups", "gated off - on (whispered)", "-10.1", ext.earsGatedOffMinusOn["ears-whisper"]);
	add("earsWhisperSetups", "TEN drops - TEN cuts (whispered)", "not in paper", ext.earsTenDropsMinusTenCuts);
	for (const [e, t] of Object.entries(ext.voicesBabbleMinusFar as Record<string, Test>)) add("voicesBabbleMinusFar", e, "babble raises every system", t);
	for (const [e, t] of Object.entries(ext.voicesTvMinusFar as Record<string, Test>)) add("voicesTvMinusFar", e, e === "zoom-scribe" ? "Zoom +2.6, CI includes zero" : "TV raises WER", t);
}

// Holm within each family
const holm: Record<string, unknown> = {};
for (const [fam, tests] of Object.entries(families)) {
	const names = Object.keys(tests).sort((a, b) => tests[a].p - tests[b].p), m = names.length;
	let running = 0;
	for (const [i, n] of names.entries()) {
		running = Math.max(running, Math.min(1, (m - i) * tests[n].p));
		Object.assign(tests[n], { pHolm: +running.toFixed(4), survives: running < 0.05, bcaExcludesZero: tests[n].bca[0] > 0 || tests[n].bca[1] < 0 });
	}
	holm[fam] = { tests: m, nominal: names.filter((n) => tests[n].p < 0.05).length, holm: names.filter((n) => (tests[n] as unknown as { survives: boolean }).survives).length };
}

console.log(JSON.stringify({ resamples: B, holm, families, namesBySubset, saidPairs, saidMinusScript, mixSaid, mixDiff, nvArabic, whisperIn, csFilter, pause, voicesWithoutNoText: ext?.voicesWithoutNoText ?? null }, null, 1));
