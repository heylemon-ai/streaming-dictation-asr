/**
 * Builds the two-language recordings from clips already in data/:
 *
 *   npm run make-codeswitch            # build any that are missing
 *   npm run make-codeswitch -- --rebuild
 *
 * Two kinds, 400 recordings in all:
 *   english  100: for each of 10 non-English sets, 10 of its clips each joined to
 *            one of the 10 shortest English dictation clips (5 with English first,
 *            5 with English second).
 *   pair     300: every combination of German, Spanish, French, Arabic, Hindi and
 *            Mandarin (15 pairs), 20 recordings each, 10 with each language first.
 *            Spanish and Arabic rotate through their dialect sets.
 *
 * Each half is trimmed to speech, brought to the same loudness and joined with a
 * 300 ms pause, so it plays like one person switching language mid-dictation
 * (with two voices). Urdu is left out because some engines have no Urdu setting,
 * so a lost Urdu half would say nothing about switching.
 *
 * Writes data/codeswitch/*.wav and data/codeswitch/mixes.tsv.
 */

import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { readWav, writeWav16 } from "../src/audio/wav";
import { DATA_DIR, readManifest, writeTsv, type Clip } from "../src/manifest";

const OTHER_SETS = ["ar-eg", "ar-sa", "ar-ae", "de-de", "es-419", "es-es", "es-pr", "fr-fr", "hi-in", "zh-cn"];
const PER_SET = 10;
const ENGLISH_POOL = 10;
const LANGUAGE_SETS: Record<string, string[]> = {
	de: ["de-de"],
	es: ["es-419", "es-es", "es-pr"],
	fr: ["fr-fr"],
	ar: ["ar-eg", "ar-sa", "ar-ae"],
	hi: ["hi-in"],
	zh: ["zh-cn"],
};
const PER_PAIR = 20;
const GAP_MS = 300;
const rebuild = process.argv.includes("--rebuild");

/** Trim to speech (padded 150 ms) by frame energy relative to the clip's own loud frames. */
function trimToSpeech(s: Float32Array, sr: number): Float32Array {
	const frame = Math.round(sr * 0.02);
	const rms: number[] = [];
	for (let i = 0; i + frame <= s.length; i += frame) {
		let e = 0;
		for (let j = i; j < i + frame; j++) e += s[j] * s[j];
		rms.push(Math.sqrt(e / frame));
	}
	const loud = [...rms].sort((a, b) => a - b)[Math.floor(rms.length * 0.95)] ?? 0;
	const thr = Math.max(0.003, loud * 0.1);
	const first = rms.findIndex((r) => r > thr);
	let last = rms.length - 1;
	while (last > 0 && rms[last] <= thr) last--;
	if (first < 0) return s;
	const pad = Math.round(sr * 0.15);
	return s.subarray(Math.max(0, first * frame - pad), Math.min(s.length, (last + 1) * frame + pad));
}

/** Bring speech to one loudness so neither half is the quiet one. */
function levelTo(s: Float32Array, target = 0.06): Float32Array {
	let e = 0, n = 0, peak = 0;
	for (const v of s) {
		peak = Math.max(peak, Math.abs(v));
		if (Math.abs(v) > 0.005) (e += v * v), n++;
	}
	const rms = n ? Math.sqrt(e / n) : 0;
	if (!rms) return s;
	const gain = Math.min(target / rms, 0.95 / peak);
	return s.map((v) => v * gain);
}

type Row = Record<string, string>;
const dir = resolve(DATA_DIR, "codeswitch");
mkdirSync(dir, { recursive: true });
const clips = readManifest();
const rows: Row[] = [];

function join(id: string, kind: "english" | "pair", halves: Clip[]) {
	const file = `${id}.wav`;
	const path = resolve(dir, file);
	let samples: number;
	if (existsSync(path) && !rebuild) samples = readWav(path).samples.length;
	else {
		const audio = halves.map((c) => levelTo(trimToSpeech(readWav(resolve(DATA_DIR, c.file)).samples, 16000)));
		const gap = Math.round(16000 * (GAP_MS / 1000));
		const out = new Float32Array(audio[0].length + gap + audio[1].length);
		out.set(audio[0], 0);
		out.set(audio[1], audio[0].length + gap);
		writeFileSync(path, writeWav16(out, 16000));
		samples = out.length;
	}
	rows.push({
		id,
		file,
		kind,
		first_set: halves[0].set, first_clip: halves[0].id, first_language: halves[0].language, first_reference: halves[0].reference,
		second_set: halves[1].set, second_clip: halves[1].id, second_language: halves[1].language, second_reference: halves[1].reference,
		duration_sec: (samples / 16000).toFixed(2),
	});
}

const english = clips.filter((c) => c.set === "en-dictation").sort((a, b) => Number(a.duration_sec) - Number(b.duration_sec)).slice(0, ENGLISH_POOL);
if (!english.length) throw new Error("No en-dictation clips in the manifest. Run `npm run manifest` first.");
OTHER_SETS.forEach((set, si) => {
	clips.filter((c) => c.set === set).slice(0, PER_SET).forEach((other, k) => {
		const en = english[(si + k) % english.length];
		const order = k < PER_SET / 2 ? "en-first" : "en-second";
		join(`${set}-${String(k + 1).padStart(2, "0")}-${order}`, "english", order === "en-first" ? [en, other] : [other, en]);
	});
});

const pool = (lang: string) => {
	const bySet = LANGUAGE_SETS[lang].map((s) => clips.filter((c) => c.set === s));
	const longest = Math.max(...bySet.map((b) => b.length));
	return Array.from({ length: longest }, (_, i) => bySet.map((b) => b[i]).filter(Boolean)).flat();
};
const langs = Object.keys(LANGUAGE_SETS);
const allPairs = langs.flatMap((a, i) => langs.slice(i + 1).map((b) => [a, b] as [string, string]));
const firstPairs = ["de-es", "de-fr", "es-fr"];
const pairs = [...allPairs.filter((p) => firstPairs.includes(p.join("-"))), ...allPairs.filter((p) => !firstPairs.includes(p.join("-")))];
pairs.forEach(([a, b], pi) => {
	const pa = pool(a), pb = pool(b);
	for (let k = 0; k < PER_PAIR; k++) {
		const ca = pa[(pi * 7 + k) % pa.length], cb = pb[(pi * 11 + k) % pb.length];
		const aFirst = k < PER_PAIR / 2;
		join(`${a}-${b}-${String(k + 1).padStart(2, "0")}-${aFirst ? a : b}-first`, "pair", aFirst ? [ca, cb] : [cb, ca]);
	}
});

const cols = ["id", "file", "kind", "first_set", "first_clip", "first_language", "first_reference", "second_set", "second_clip", "second_language", "second_reference", "duration_sec"];
writeFileSync(resolve(dir, "mixes.tsv"), writeTsv(rows, cols));
console.log(`${rows.length} two-language recordings → data/codeswitch/ (${rows.filter((r) => r.kind === "english").length} with English, ${rows.filter((r) => r.kind === "pair").length} non-English pairs)`);
