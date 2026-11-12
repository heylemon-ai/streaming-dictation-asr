/**
 * Failure analysis for the paper: where and how each engine fails, from the per-clip
 * transcripts in cache/clips/ (local only, never committed).
 *
 *   npx tsx paper/analysis/failures.ts > paper/analysis/failures.json
 *
 * Whisper and Qwen are taken from the runs without the client VAD gate, so every
 * engine is compared on the same audio. Only aggregates are written out.
 *
 * gemini-smart (Gemini's SMART mode) and elevenlabs-scribe-clean (ElevenLabs with no_verbatim) get
 * their own per-system figures, but the shared-difficulty count uses the nine distinct systems in
 * ENG (eleven), so one model is not counted twice.
 */
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { tokens, unitFor } from "../../src/score";

type Row = Record<string, string>;
const ROOT = resolve(import.meta.dirname, "../..");
const readTsv = (p: string): Row[] => {
	const [head, ...lines] = readFileSync(resolve(ROOT, p), "utf-8").split("\n").filter(Boolean);
	const cols = head.split("\t");
	return lines.map((l) => Object.fromEntries(l.split("\t").map((v, i) => [cols[i], v])));
};

const ENG = ["whisper-self-hosted", "qwen", "meta", "gemini", "deepgram", "assemblyai-3-6-pro", "assemblyai-3-5-pro", "zoom-scribe", "elevenlabs-scribe", "openai-live-transcribe-low", "openai-realtime-whisper"];
// Main comparison: eleven distinct systems plus the two clean-up rows. Whisper is represented by the self-hosted
// deployment (VAD cuts only) and OpenAI's Realtime Whisper; the other Whisper setups are read only for the Whisper
// guide: gated Whisper V3 without its VAD, the self-hosted deployment with the VAD dropping audio, Whisper-1 and Whisper-1 split.
const main = readTsv("cache/clips/2026-10-21-main.tsv");
const family = readTsv("cache/clips/2026-10-21-whisper-family.tsv").filter((r) => r.engine !== "whisper" && r.engine !== "whisper-self-hosted" && r.engine !== "openai-realtime-whisper");
const gatedNoVad = readTsv("cache/clips/2026-10-13-whisper-no-vad.tsv");
const rows = [...main, ...family, ...gatedNoVad].filter((r) => r.run === "0" && !r.error?.startsWith("connect") && r.set !== "nonspeech");
const LANG: Record<string, string> = { "en-dictation": "en", "en-dictation-noise": "en", "en-dictation-whisper": "en", "ar-eg": "ar", "ar-sa": "ar", "ar-ae": "ar", "de-de": "de", "es-419": "es", "es-es": "es", "es-pr": "es", "fr-fr": "fr", "hi-in": "hi", "ur-pk": "ur", "zh-cn": "zh" };

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

const longestRun = (o: Op[], t: Op["t"]) => { let best = 0, cur = 0, end = -1; o.forEach((x, k) => { if (x.t === t) { cur++; if (cur > best) { best = cur; end = k; } } else cur = 0; }); return { len: best, end }; };
const lev = (a: string, b: string) => { let p = Array.from({ length: b.length + 1 }, (_, j) => j); for (let i = 1; i <= a.length; i++) { const c = [i]; for (let j = 1; j <= b.length; j++) c[j] = Math.min(p[j] + 1, c[j - 1] + 1, p[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); p = c; } return p[b.length]; };
const SPELLED = new Set("zero one two three four five six seven eight nine ten eleven twelve thirteen fourteen fifteen sixteen seventeen eighteen nineteen twenty thirty forty fifty sixty seventy eighty ninety hundred thousand million first second third percent".split(" "));

type Acc = Record<string, number>;
const out: Record<string, Record<string, Acc>> = {};
const add = (sec: string, e: string, k: string, v = 1) => { ((out[sec] ??= {})[e] ??= {})[k] = (((out[sec][e] ??= {})[k]) ?? 0) + v; };

// Names. With the checked list (paper/analysis/names-checked.json), a name is a
// listed word written with a capital anywhere in the message; each capitalised word was marked as a name or not, and
// names the capital-letter rule misses were added. Without it, the rule alone: words capitalised mid-sentence.
const CHECKED_PATH = resolve(ROOT, "paper/analysis/names-checked.json");
const checked: { names: string[]; perClip: Record<string, string[]> } | null = existsSync(CHECKED_PATH) ? JSON.parse(readFileSync(CHECKED_PATH, "utf-8")) : null;
const namesIn = (ref: string, clip: string) => {
	if (!checked) return proper(ref);
	const ok = new Set(checked.names);
	for (const [w, clips] of Object.entries(checked.perClip)) if (clips.includes(clip)) ok.add(w);
	return new Set(ref.split(/\s+/).filter((w) => /^[A-Z]/.test(w)).map((w) => w.replace(/[^\p{L}\p{N}]/gu, "").toLowerCase()).filter((w) => ok.has(w)));
};
// The capital-letter rule: words capitalised mid-sentence in the English references
const proper = (ref: string) => new Set(ref.split(/\s+/).filter((w, i, a) => i > 0 && !/[.!?:]$/.test(a[i - 1]) && /^[A-Z][a-zA-Z]+/.test(w)).map((w) => w.replace(/[^\p{L}\p{N}]/gu, "").toLowerCase()));

const perClip: Record<string, Record<string, number>> = {};
for (const r of rows) {
	const lang = LANG[r.set];
	if (!lang) continue;
	const unit = unitFor(lang);
	const ref = tokens(r.reference, lang, unit), hyp = tokens(r.transcript ?? "", lang, unit);
	if (!ref.length) continue;
	const o = ops(ref, hyp);
	const err = o.filter((x) => x.t !== "hit").length / ref.length;
	(perClip[`${r.set}|${r.clip}`] ??= {})[r.engine] = err;
	const group = r.set.startsWith("en-dictation") ? r.set : "languages";
	const sec = `tails:${group}`;
	add(sec, r.engine, "clips"); if (err >= 0.5) { add(sec, r.engine, "ge50"); add("worstBySet", r.engine, r.set); } if (err >= 0.9) add(sec, r.engine, "ge90"); if (!hyp.length) add(sec, r.engine, "empty");
	// Lost spans: runs of 5+ consecutive reference words deleted, and where they fall
	const refOps = o.filter((x) => x.t !== "ins");
	const dl = longestRun(refOps, "del");
	add(`spans:${group}`, r.engine, "clips");
	if (dl.len >= 5 && hyp.length) {
		const pos = (dl.end + 1 - dl.len / 2) / refOps.length;
		add(`spans:${group}`, r.engine, pos < 1 / 3 ? "start" : pos > 2 / 3 ? "end" : "middle");
	}
	// Tail cut: the last 3+ reference words missing
	let tail = 0; for (let k = refOps.length - 1; k >= 0 && refOps[k].t === "del"; k--) tail++;
	if (tail >= 3 && hyp.length) add(`spans:${group}`, r.engine, "tailcut");
	let head = 0; for (let k = 0; k < refOps.length && refOps[k].t === "del"; k++) head++;
	if (head >= 3 && hyp.length) add(`spans:${group}`, r.engine, "headcut");
	// Added text: runs of 3+ inserted words
	if (longestRun(o, "ins").len >= 3) add(`spans:${group}`, r.engine, "addedRun");
	// Error mix
	for (const x of o) if (x.t !== "hit") add(`mix:${group}`, r.engine, x.t);
	add(`mix:${group}`, r.engine, "ref", ref.length);
	for (const x of o) if (x.t !== "hit") add(`mix:set:${r.set}`, r.engine, x.t);
	add(`mix:set:${r.set}`, r.engine, "ref", ref.length);
	if (lang === "en") {
		// Numbers: reference digits and spelled numbers
		for (const x of o) {
			if (!x.r) continue;
			if (/^\d+$/.test(x.r)) { add("numbers", r.engine, "digitRef"); if (x.t === "hit") add("numbers", r.engine, "digitHit"); else if (x.h && SPELLED.has(x.h)) add("numbers", r.engine, "digitAsWord"); }
			if (SPELLED.has(x.r)) { add("numbers", r.engine, "wordRef"); if (x.t === "hit") add("numbers", r.engine, "wordHit"); else if (x.h && /^\d+$/.test(x.h)) add("numbers", r.engine, "wordAsDigit"); }
		}
		// Proper nouns vs other words
		const P = namesIn(r.reference, r.clip);
		for (const x of o) if (x.r) { const k = P.has(x.r) ? "proper" : "other"; add("names", r.engine, `${k}Ref`); if (x.t === "hit") add("names", r.engine, `${k}Hit`); }
		// What the wrong words are: number written the other way, a name, a near-miss spelling (1-2 letters, words of 4+ letters), or another word
		for (const x of o) {
			if (x.t !== "sub" || !x.r || !x.h) continue;
			const num = (/^\d+$/.test(x.r) && SPELLED.has(x.h)) || (SPELLED.has(x.r) && /^\d+$/.test(x.h));
			const kind = num ? "number" : P.has(x.r) ? "name" : x.r.length >= 4 && x.h.length >= 4 && lev(x.r, x.h) <= 2 ? "close" : "other";
			add(`subkind:${r.set}`, r.engine, kind);
		}
	}
}

// Shared vs engine-specific difficulty: per clip, how many engines exceed 30% error
const hard: Record<string, number> = {};
const soloHard: Record<string, number> = {};
const hardAllBySet: Record<string, number> = {};
const soloHardBySet: Record<string, number> = {};
for (const [k, m] of Object.entries(perClip)) {
	const es = ENG.filter((e) => m[e] != null);
	if (es.length < ENG.length) continue;
	const bad = es.filter((e) => m[e] >= 0.3);
	const g = k.startsWith("en-dictation") ? k.split("|")[0] : "languages";
	hard[`${g}|${bad.length}`] = (hard[`${g}|${bad.length}`] ?? 0) + 1;
	if (bad.length === 1) soloHard[bad[0]] = (soloHard[bad[0]] ?? 0) + 1;
	if (bad.length === es.length) hardAllBySet[k.split("|")[0]] = (hardAllBySet[k.split("|")[0]] ?? 0) + 1;
	if (bad.length === 1) soloHardBySet[`${bad[0]}|${k.split("|")[0]}`] = (soloHardBySet[`${bad[0]}|${k.split("|")[0]}`] ?? 0) + 1;
}

// Code-switching failure modes, on all recordings (cs-all:) and on those kept by the filter (cs:)
const csRows = readTsv("cache/clips/2026-11-05-codeswitch-main.tsv");
const words = (t: string) => t.toLowerCase().match(/[a-z']+/g) ?? [];
const EN_FUNCTION = new Set("the a an of to and in is are was were be for on with that this it as at by from or but not have has had will would can could i you he she we they his her their our which who what when where there been more some all".split(" "));
for (const [prefix, cs] of [["cs-all", csRows], ["cs", csRows.filter((r) => r.counted === "yes")]] as const) for (const r of cs) {
	const sec = `${prefix}:${r.kind}:${r.setting}`;
	add(sec, r.engine, "n");
	for (const [half, v, l] of [["first", r.first_verdict, r.first_language], ["second", r.second_verdict, r.second_language]] as const) {
		if (v === "missing" || v === "replaced") { add(sec, r.engine, v); add(sec, r.engine, `${half}Lost`); add(sec, r.engine, l === "en" ? "enLost" : "otherLost"); }
	}
	// replaced into English: the other language's half replaced and the transcript is mostly Latin script
	const otherV = r.first_language === "en" ? r.second_verdict : r.first_verdict;
	const latin = (r.transcript.match(/\p{Script=Latin}/gu) ?? []).length / Math.max(1, (r.transcript.match(/\p{L}/gu) ?? []).length);
	const otherL = r.first_language === "en" ? r.second_language : r.first_language;
	// Only measurable when the other language has its own script (Arabic, Hindi, Mandarin).
	// A Latin-letter replacement is either an English translation or the other language spelled out in
	// Latin letters (romanised: "police ne kaha ki ...", or sound-alike nonsense for Arabic). Tell them apart
	// by the words that are not in the English part's script: an English translation is full of English
	// function words, a romanisation has almost none.
	if (r.kind === "english" && ["ar", "hi", "zh"].includes(otherL)) {
		add(sec, r.engine, "nonLatinN");
		if (otherV === "replaced" && latin > 0.9) {
			const enRef = new Set(words(r.first_language === "en" ? r.first_reference : r.second_reference));
			const rest = words(r.transcript).filter((w) => !enRef.has(w));
			const fn = rest.filter((w) => EN_FUNCTION.has(w)).length / Math.max(1, rest.length);
			add(sec, r.engine, rest.length >= 4 && fn >= 0.15 ? "translatedToEnglish" : "romanised");
		}
	}
}

console.log(JSON.stringify({ out, hard, soloHard, hardAllBySet, soloHardBySet }, null, 1));
