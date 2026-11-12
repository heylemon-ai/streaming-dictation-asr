/**
 * Error rates against a reference transcript.
 *
 * NORMALIZED scoring (the headline) cleans both sides the same way before
 * counting, so it measures words heard wrong rather than formatting:
 *   - Unicode NFKC, lower case
 *   - apostrophes dropped ("don't" = "dont"), dots inside abbreviations dropped ("U.S." = "US")
 *   - every other punctuation mark and symbol treated as a space
 *   - Arabic and Urdu: short-vowel marks and tatweel removed
 *   - Arabic: alef forms (أ إ آ) folded to ا, ta marbuta (ة) to ه, and alef maqsura (ى)
 *     to ي. These are spelling variants that references and engines write inconsistently.
 *   - Chinese: Traditional converted to Simplified, so script choice is not scored as mishearing
 * Numbers are NOT normalized: "7" against "seven" counts as an error, because a
 * dictation user receives the written form.
 *
 * FORMATTED scoring keeps case and punctuation (each mark is its own token),
 * because dictated text is read exactly as written.
 *
 * Units: words for most languages; for Chinese, Mixed Error Rate (MER), where
 * each Chinese character is one token and each run of Latin letters or digits
 * is one token. Character error rate (CER) is also computed for every language.
 */

import * as OpenCC from "opencc-js";

export type Score = { errors: number; refLen: number; sub: number; del: number; ins: number; hypLen: number };

const toSimplified: (s: string) => string = OpenCC.Converter({ from: "t", to: "cn" });

export function normalize(text: string, language: string): string {
	let t = text.normalize("NFKC").toLowerCase();
	if (language === "zh") t = toSimplified(t);
	if (language === "ar" || language === "ur") t = t.replace(/[ً-ٰٟۖ-ۭ]/g, "").replace(/ـ/g, "");
	if (language === "ar") t = t.replace(/[أإآ]/g, "ا").replace(/ة/g, "ه").replace(/ى/g, "ي");
	t = t.replace(/['’ʼ`´]/g, "");
	t = t.replace(/(\p{L})\.(?=\p{L})/gu, "$1");
	t = t.replace(/[\p{P}\p{S}]/gu, " ");
	return t.replace(/\s+/g, " ").trim();
}

export const unitFor = (language: string): "wer" | "mer" => (language === "zh" ? "mer" : "wer");

const mixedTokens = (s: string) => s.match(/[\p{Script=Latin}\p{N}]+|[^\s\p{Script=Latin}\p{N}]/gu) ?? [];

export function tokens(text: string, language: string, unit: "wer" | "mer" | "cer"): string[] {
	const n = normalize(text, language);
	if (unit === "wer") return n ? n.split(" ") : [];
	if (unit === "mer") return mixedTokens(n);
	return [...n.replace(/\s/g, "")];
}

/** Case and punctuation kept: words and individual punctuation marks are separate tokens. */
export function formattedTokens(text: string, language: string): string[] {
	let t = text.normalize("NFKC").replace(/[’ʼ`´]/g, "'");
	if (language === "zh") t = toSimplified(t);
	const re = language === "zh" ? /[\p{Script=Latin}\p{N}']+|[\p{P}\p{S}]|[^\s\p{P}\p{S}]/gu : /[\p{L}\p{N}'.]+(?<!\.)|[\p{P}\p{S}]/gu;
	return t.match(re) ?? [];
}

/** Levenshtein alignment over tokens, keeping the substitution / deletion / insertion split. */
export function align(ref: string[], hyp: string[]): Score {
	const m = ref.length, n = hyp.length;
	let prev = Array.from({ length: n + 1 }, (_, j) => ({ c: j, s: 0, d: 0, i: j }));
	for (let i = 1; i <= m; i++) {
		const cur = [{ c: i, s: 0, d: i, i: 0 }];
		for (let j = 1; j <= n; j++) {
			if (ref[i - 1] === hyp[j - 1]) {
				cur.push({ ...prev[j - 1] });
				continue;
			}
			const sub = prev[j - 1], del = prev[j], ins = cur[j - 1];
			const best = Math.min(sub.c, del.c, ins.c);
			cur.push(
				best === sub.c ? { ...sub, c: sub.c + 1, s: sub.s + 1 }
				: best === del.c ? { ...del, c: del.c + 1, d: del.d + 1 }
				: { ...ins, c: ins.c + 1, i: ins.i + 1 },
			);
		}
		prev = cur;
	}
	const e = prev[n];
	return { errors: e.c, refLen: m, sub: e.s, del: e.d, ins: e.i, hypLen: n };
}

export type ClipScores = { headline: Score; formatted: Score; cer: Score; unit: "wer" | "mer" };

export function scoreClip(reference: string, hypothesis: string, language: string): ClipScores {
	const unit = unitFor(language);
	return {
		unit,
		headline: align(tokens(reference, language, unit), tokens(hypothesis, language, unit)),
		formatted: align(formattedTokens(reference, language), formattedTokens(hypothesis, language)),
		cer: align(tokens(reference, language, "cer"), tokens(hypothesis, language, "cer")),
	};
}

/** Corpus-level rate: total errors over total reference length, not a mean of per-clip rates. */
export function rate(scores: Score[]): number {
	const ref = scores.reduce((a, s) => a + s.refLen, 0);
	return ref ? scores.reduce((a, s) => a + s.errors, 0) / ref : 0;
}
