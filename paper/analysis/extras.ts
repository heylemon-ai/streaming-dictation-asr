/**
 * Extra measures for the paper, from the main run's per-clip transcripts (cache/clips/2026-10-21-main.tsv,
 * local only). Only aggregates are written out.
 *
 *   npx tsx paper/analysis/extras.ts > paper/analysis/extras.json
 *
 * - langBest:  for each language set, the lowest-WER row against the next lowest, paired bootstrap over clips.
 * - noEdit:    share of English clips with no word error, and with no formatted error (the text needs no edit).
 * - cer:       character error rate on Hindi and Urdu, to separate misspelled words from misheard ones.
 * - waitByLen: median wait by clip length, English clips.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { align, formattedTokens, scoreClip, tokens, unitFor } from "../../src/score";
import { pairedBootstrap } from "../../src/stats";
import { readManifest } from "../../src/manifest";

const ROOT = resolve(import.meta.dirname, "../..");
type Row = Record<string, string>;
const readTsv = (p: string): Row[] => {
	const [head, ...lines] = readFileSync(resolve(ROOT, p), "utf-8").split("\n").filter(Boolean);
	const cols = head.split("\t");
	return lines.map((l) => Object.fromEntries(l.split("\t").map((v, i) => [cols[i], v])));
};
const ROWS = ["whisper-self-hosted", "qwen", "meta", "gemini", "gemini-smart", "deepgram", "assemblyai-3-6-pro", "assemblyai-3-5-pro", "zoom-scribe", "elevenlabs-scribe", "elevenlabs-scribe-clean", "openai-live-transcribe-low", "openai-realtime-whisper"];
const main = readTsv("cache/clips/2026-10-21-main.tsv").filter((r) => ROWS.includes(r.engine) && r.run === "0");
const manifest = new Map(readManifest().map((c) => [c.id, c]));
const lang = (r: Row) => manifest.get(r.clip)!.language;
// Each clip is scored once: the bootstrap below draws the same clips thousands of times.
const scored = new Map<Row, ReturnType<typeof scoreClip>>();
const score = (r: Row) => { let v = scored.get(r); if (!v) { v = scoreClip(r.reference, r.transcript ?? "", lang(r)); scored.set(r, v); } return v; };
const out: Record<string, unknown> = {};

// Language sets: is the lowest row clearly lower than the next? Rows with no option for the language are not ranked.
const LANGS = ["ar-eg", "ar-sa", "ar-ae", "de-de", "es-419", "es-es", "es-pr", "fr-fr", "hi-in", "zh-cn", "ur-pk"];
const results = JSON.parse(readFileSync(resolve(ROOT, "results/2026-10-21-main/results.json"), "utf-8")).aggregates;
const langBest: Record<string, unknown> = {};
for (const set of LANGS) {
	const ranked = ROWS.filter((e) => !results[`${set}/${e}`].languageNotSupported).sort((a, b) => results[`${set}/${a}`].headline.value - results[`${set}/${b}`].headline.value);
	const [best, next] = ranked;
	const byClip = (e: string) => new Map(main.filter((r) => r.set === set && r.engine === e).map((r) => [r.clip, r]));
	const A = byClip(best), B = byClip(next);
	const pairs = [...A.keys()].filter((k) => B.has(k)).map((k) => ({ a: A.get(k)!, b: B.get(k)! }));
	const pr = pairedBootstrap(pairs, (p) => p.a.clip, (p) => score(p.a).headline, (p) => score(p.b).headline);
	langBest[set] = { best, next, diff: +(100 * pr.diff).toFixed(1), lo: +(100 * pr.lo).toFixed(1), hi: +(100 * pr.hi).toFixed(1), clear: pr.hi < 0 };
}
out.langBest = langBest;

// English columns of Table 1: is the lowest row clearly lower than the next? Words and formatted.
const enBest: Record<string, unknown> = {};
for (const set of ["en-dictation", "en-dictation-noise", "en-dictation-whisper"]) {
	for (const kind of ["headline", "formatted"] as const) {
		const val = (e: string) => results[`${set}/${e}`][kind === "headline" ? "headline" : "formatted"];
		const num = (v: number | { value: number }) => (typeof v === "number" ? v : v.value);
		const [best, next] = [...ROWS].sort((a, b) => num(val(a)) - num(val(b)));
		const byClip = (e: string) => new Map(main.filter((r) => r.set === set && r.engine === e).map((r) => [r.clip, r]));
		const A = byClip(best), B = byClip(next);
		const pairs = [...A.keys()].filter((k) => B.has(k)).map((k) => ({ a: A.get(k)!, b: B.get(k)! }));
		const pr = pairedBootstrap(pairs, (p) => p.a.clip, (p) => score(p.a)[kind], (p) => score(p.b)[kind]);
		enBest[`${set}/${kind}`] = { best, next, hi: +(100 * pr.hi).toFixed(2), clear: pr.hi < 0 };
	}
}
out.enBest = enBest;

// Messages that need no edit.
const noEdit: Record<string, Record<string, { clips: number; noWordError: number; noFormattedError: number }>> = {};
for (const r of main.filter((x) => x.set.startsWith("en-dictation"))) {
	const s = score(r);
	const a = ((noEdit[r.set] ??= {})[r.engine] ??= { clips: 0, noWordError: 0, noFormattedError: 0 });
	a.clips++;
	if (s.headline.errors === 0) a.noWordError++;
	if (s.formatted.errors === 0) a.noFormattedError++;
}
out.noEdit = noEdit;

// Character error rate on Hindi and Urdu.
const cer: Record<string, Record<string, { wer: number; cer: number }>> = {};
// Devanagari spelling variants that the main scorer does not merge: nukta forms, chandrabindu vs anusvara,
// zero-width joiners. Used only for the Hindi re-score below.
const indic = (t: string) => t.normalize("NFD").replace(/\u093C/g, "").replace(/\u0901/g, "\u0902").replace(/[\u200C\u200D]/g, "").normalize("NFC");
for (const set of ["hi-in", "ur-pk", "ar-eg", "ar-sa", "ar-ae"]) {
	for (const e of ROWS) {
		const rs = main.filter((r) => r.set === set && r.engine === e);
		let we = 0, wn = 0, ce = 0, cn = 0;
		for (const r of rs) {
			const l = lang(r);
			const w = align(tokens(r.reference, l, unitFor(l)), tokens(r.transcript ?? "", l, unitFor(l)));
			const c = align(tokens(r.reference, l, "cer"), tokens(r.transcript ?? "", l, "cer"));
			we += w.errors; wn += w.refLen; ce += c.errors; cn += c.refLen;
		}
		const entry: Record<string, number> = { wer: +((100 * we) / wn).toFixed(1), cer: +((100 * ce) / cn).toFixed(1) };
		if (set === "hi-in") {
			let ie = 0, iN = 0;
			for (const r of rs) {
				const w = align(tokens(indic(r.reference), "hi", "wer"), tokens(indic(r.transcript ?? ""), "hi", "wer"));
				ie += w.errors; iN += w.refLen;
			}
			entry.werIndic = +((100 * ie) / iN).toFixed(1);
		}
		(cer[set] ??= {})[e] = entry;
	}
}
out.cer = cer;

// Wait by clip length (English sets), median per bucket.
const BUCKETS: [string, number, number][] = [["<20 s", 0, 20], ["20-40 s", 20, 40], ["40-60 s", 40, 60], [">=60 s", 60, 1e9]];
const median = (xs: number[]) => { const s = [...xs].sort((a, b) => a - b); return s.length ? s[Math.floor((s.length - 1) / 2)] : NaN; };
const waitByLen: Record<string, Record<string, number>> = {};
const counts: Record<string, number> = {};
for (const e of ROWS) {
	for (const [name, lo, hi] of BUCKETS) {
		const rs = main.filter((r) => r.engine === e && r.set.startsWith("en-dictation") && !r.error && r.latency_ms && +manifest.get(r.clip)!.duration_sec >= lo && +manifest.get(r.clip)!.duration_sec < hi);
		(waitByLen[e] ??= {})[name] = median(rs.map((r) => +r.latency_ms));
		counts[name] = rs.length;
	}
}
out.waitByLen = waitByLen;

// Two-language recordings without the filter: share of ALL recordings that lose a language.
const cs = readTsv("cache/clips/2026-11-05-codeswitch-main.tsv");
const csAll: Record<string, Record<string, { all: number; lostAll: number; kept: number; lostKept: number }>> = {};
for (const r of cs) {
	const k = `${r.kind}/${r.setting}`;
	const a = ((csAll[k] ??= {})[r.engine] ??= { all: 0, lostAll: 0, kept: 0, lostKept: 0 });
	const lost = ["missing", "replaced"].includes(r.first_verdict) || ["missing", "replaced"].includes(r.second_verdict);
	a.all++; if (lost) a.lostAll++;
	if (r.counted === "yes") { a.kept++; if (lost) a.lostKept++; }
}
out.csAll = csAll;
out.waitByLenClips = counts;
console.log(JSON.stringify(out, null, 1));
