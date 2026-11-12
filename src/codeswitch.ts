/**
 * Two languages in one recording: does the engine write both, or drop one?
 *
 *   npm run make-codeswitch                       # build the recordings (once)
 *   npm run codeswitch -- --engines whisper,gemini
 *   npm run codeswitch -- --kinds english --settings both,en --limit 10
 *   npm run codeswitch -- --engines meta --concurrency 2 --gap 500   # slower, for rate-limited providers
 *   npm run codeswitch -- --report-only
 *
 * Each recording is played under the language settings a person can choose:
 *   both  both spoken languages selected (language "auto" plus the two as options)
 *   en    English only, a common default (recordings with English only)
 *   auto  auto-detect
 *
 * Scoring. The transcript is aligned against both halves' references end to end,
 * and each reference word is marked heard, replaced or missing. A half with under
 * 20% of its words heard counts as lost: "missing" if mostly absent, "replaced" if
 * something else took its place (a translation, the wrong script, a mishearing).
 *
 * Fairness. A recording counts only if every engine compared gets each half right
 * (at least 50% of words) when that clip is played alone, taken from a main run's
 * cache (--solo-cache, default "results"). A lost half is then caused by the
 * switch, not by the engine being unable to hear that clip at all.
 * --fair-engines a,b,c checks fairness against that list instead of the reported
 * engines, so a setting variant (e.g. gemini-smart) can be reported on the same
 * recordings as the standard comparison without changing which recordings count.
 *
 * Output: results/<date>-codeswitch/summary.md and codeswitch.json (aggregates only).
 */

import { config } from "dotenv";
import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { readWav } from "./audio/wav";
import { cacheKey, loadCache, loadCaches, profileHash, saveCache, type Cached } from "./cache";
import { ENGINES, shaperFor } from "./engines";
import { transcribe } from "./engines/harness";
import type { EngineAdapter } from "./engines/types";
import { DATA_DIR, readManifest, readTsv, writeTsv, type Clip } from "./manifest";
import { loadProfile, ROOT } from "./profile";
import { normalize } from "./score";

config({ path: resolve(ROOT, ".env"), quiet: true });

const arg = (n: string) => {
	const i = process.argv.indexOf(`--${n}`);
	return i >= 0 ? process.argv[i + 1] : undefined;
};
const flag = (n: string) => process.argv.includes(`--${n}`);

type Kind = "english" | "pair";
export type Setting = "both" | "en" | "auto";
const SETTINGS_FOR: Record<Kind, Setting[]> = { english: ["both", "en", "auto"], pair: ["both", "auto"] };
const LOST = 0.2, THROUGH = 0.5;

type Part = { set: string; clip: string; language: string; reference: string };
type Mix = { id: string; file: string; kind: Kind; parts: Part[] };

export function readMixes(): Mix[] {
	return readTsv(resolve(DATA_DIR, "codeswitch", "mixes.tsv")).map((r) => ({
		id: r.id,
		file: `codeswitch/${r.file}`,
		kind: r.kind as Kind,
		parts: [
			{ set: r.first_set, clip: r.first_clip, language: r.first_language, reference: r.first_reference },
			{ set: r.second_set, clip: r.second_clip, language: r.second_language, reference: r.second_reference },
		],
	}));
}

const languagesOf = (m: Mix) => m.parts.map((p) => p.language);
const languageFor = (m: Mix, s: Setting) => (s === "both" ? { language: "auto", languageOptions: languagesOf(m) } : { language: s });

// ---------------------------------------------------------------------------
// Scoring

/** Tokens normalized for every language in the recording; Chinese split by character, Latin and digit runs kept whole. */
function toks(text: string, languages: string[]): string[] {
	const n = languages.reduce((t, l) => normalize(t, l), text);
	if (!n) return [];
	return n.split(" ").flatMap((w) => (/\p{Script=Han}/u.test(w) ? (w.match(/[\p{Script=Latin}\p{N}]+|[^\s\p{Script=Latin}\p{N}]/gu) ?? []) : [w]));
}

type Op = "hit" | "sub" | "del";

/** Levenshtein with backtrace: one operation per reference token. */
export function alignOps(ref: string[], hyp: string[]): Op[] {
	const m = ref.length, n = hyp.length;
	const d: Uint32Array[] = Array.from({ length: m + 1 }, () => new Uint32Array(n + 1));
	for (let i = 0; i <= m; i++) d[i][0] = i;
	for (let j = 0; j <= n; j++) d[0][j] = j;
	for (let i = 1; i <= m; i++)
		for (let j = 1; j <= n; j++) d[i][j] = ref[i - 1] === hyp[j - 1] ? d[i - 1][j - 1] : 1 + Math.min(d[i - 1][j - 1], d[i - 1][j], d[i][j - 1]);
	const ops: Op[] = new Array(m);
	let i = m, j = n;
	while (i > 0) {
		if (j > 0 && ref[i - 1] === hyp[j - 1] && d[i][j] === d[i - 1][j - 1]) (ops[--i] = "hit"), j--;
		else if (j > 0 && d[i][j] === d[i - 1][j - 1] + 1) (ops[--i] = "sub"), j--;
		else if (d[i][j] === d[i - 1][j] + 1) ops[--i] = "del";
		else j--;
	}
	return ops;
}

type Half = { heard: number; sub: number; del: number; n: number };
const recall = (h: Half) => (h.n ? h.heard / h.n : 0);
export type Verdict = "came through" | "partly there" | "missing" | "replaced";
export const verdictOf = (h: Half): Verdict =>
	recall(h) >= THROUGH ? "came through" : recall(h) >= LOST ? "partly there" : h.del >= h.sub ? "missing" : "replaced";
const lost = (v: Verdict) => v === "missing" || v === "replaced";

export function scoreHalves(parts: Part[], text: string): Half[] {
	const langs = parts.map((p) => p.language);
	const refs = parts.map((p) => toks(p.reference, langs));
	const ops = alignOps([...refs[0], ...refs[1]], toks(text, langs));
	return refs.map((r, k) => {
		const s = ops.slice(k === 0 ? 0 : refs[0].length, k === 0 ? refs[0].length : undefined);
		return { heard: s.filter((o) => o === "hit").length, sub: s.filter((o) => o === "sub").length, del: s.filter((o) => o === "del").length, n: r.length };
	});
}

// ---------------------------------------------------------------------------
// Running

export const CACHE_NAME = "codeswitch";
const mixHashes = new Map<string, string>();
const mixHash = (file: string) => {
	let h = mixHashes.get(file);
	if (!h) mixHashes.set(file, (h = createHash("sha1").update(readFileSync(resolve(DATA_DIR, file))).digest("hex")));
	return h;
};

/** Cache key for one recording, engine and language setting. */
export function codeswitchKey(e: EngineAdapter, mixFile: string, setting: Setting, gated: boolean, pHash: string): string {
	const parts = [e.id, e.model(), mixHash(mixFile), setting, gated ? `gate:${pHash}` : "nogate"];
	if (e.variant) parts.push(`variant:${e.variant}`);
	return createHash("sha256").update(parts.join("\u0000")).digest("hex").slice(0, 32);
}

async function main() {
	const profile = loadProfile();
	const pHash = (id: string) => profileHash(profile, id);
	const gate = !flag("no-gate");
	const keyOf = (e: EngineAdapter, m: Mix, s: Setting) => codeswitchKey(e, m.file, s, gate && profile.vadGate.enabledFor.includes(e.id), pHash(e.id));

	const kinds = (arg("kinds")?.split(",") ?? ["english", "pair"]) as Kind[];
	const wantSettings = arg("settings")?.split(",") as Setting[] | undefined;
	const limit = Number(arg("limit") ?? 0);
	let mixes = readMixes().filter((m) => kinds.includes(m.kind));
	if (limit) {
		const seen: Record<string, number> = {};
		mixes = mixes.filter((m) => (seen[m.kind] = (seen[m.kind] ?? 0) + 1) <= limit);
	}
	const wantEngines = arg("engines")?.split(",") ?? ["whisper", "gemini"];
	const engines = ENGINES.filter((e) => wantEngines.includes(e.id)).filter((e) => {
		if (flag("report-only")) return true;
		const missing = e.env.filter((k) => !process.env[k]);
		if (missing.length) console.log(`  skipping ${e.id}: ${missing.join(", ")} not set`);
		return !missing.length;
	});
	if (engines.length < 1) throw new Error("No engine is ready to run.");

	const jobs = mixes.flatMap((m) => SETTINGS_FOR[m.kind].filter((s) => !wantSettings || wantSettings.includes(s)).map((s) => ({ m, s })));
	const cache = loadCache(CACHE_NAME);
	const settled = (k: string) => cache[k] && (!cache[k].error || cache[k].error!.startsWith("dropped"));
	const concurrency = Number(arg("concurrency") ?? 4);
	const gapMs = Number(arg("gap") ?? 0);

	if (!flag("report-only")) {
		for (const e of engines) {
			const todo = jobs.map((j) => ({ ...j, key: keyOf(e, j.m, j.s) })).filter((j) => !settled(j.key));
			console.log(`  ${e.id}: ${jobs.length - todo.length} cached, ${todo.length} to run`);
			let next = 0, done = 0;
			await Promise.all(
				Array.from({ length: Math.min(concurrency, todo.length) }, async () => {
					while (next < todo.length) {
						const { m, s, key } = todo[next++];
						// Rate limits, rejected sessions and network drops are retried with growing waits.
						let r: Awaited<ReturnType<typeof transcribe>> | undefined;
						for (const wait of [0, 1_500, 3_000, 5_000, 10_000, 15_000, 30_000, 60_000]) {
							if (wait) await new Promise((ok) => setTimeout(ok, wait));
							const { shaper, sampleRate } = await shaperFor(e.id, profile, gate);
							r = await transcribe(e, shaper, readWav(resolve(DATA_DIR, m.file)), {
								...languageFor(m, s), speed: 1, feedSamples: profile.feed.samples, feedIntervalMs: profile.feed.intervalMs, sampleRate,
							});
							if (!r.error || !/rate limit|too many concurrent|ENOTFOUND|ECONNRESET|ETIMEDOUT|EAI_AGAIN|connection timed out/i.test(r.error)) break;
							console.log(`  ↻ ${e.id} ${s} ${m.id}: ${r.error}`);
						}
						if (!r) continue;
						cache[key] = { ...r, at: new Date().toISOString(), model: e.model() };
						if (r.error) console.log(`  ✗ ${e.id} ${s} ${m.id}: ${r.error}`);
						if (gapMs) await new Promise((ok) => setTimeout(ok, gapMs));
						if (++done % 10 === 0 || done === todo.length) {
							saveCache(cache, CACHE_NAME);
							console.log(`  ${e.id}: ${done}/${todo.length}`);
						}
					}
				}),
			);
			saveCache(cache, CACHE_NAME);
		}
	}

	// Solo results, for the fairness filter.
	const solo = loadCaches(arg("solo-cache") ?? "results");
	const clipById = new Map(readManifest().map((c) => [c.id, c]));
	const soloRecall = (e: EngineAdapter, c: Clip): number | undefined => {
		const r = solo[cacheKey({ engine: e.id, model: e.model(), variant: e.variant, file: c.file, language: c.language, speed: 1, gated: gate && profile.vadGate.enabledFor.includes(e.id), profile: pHash(e.id), run: 0 })];
		if (!r || (r.error && !r.error.startsWith("dropped"))) return undefined;
		const ops = alignOps(toks(c.reference, [c.language]), toks(r.error ? "" : r.text, [c.language]));
		return ops.length ? ops.filter((o) => o === "hit").length / ops.length : undefined;
	};

	const fairIds = arg("fair-engines")?.split(",");
	const fairEngines = fairIds ? ENGINES.filter((e) => fairIds.includes(e.id)) : engines;
	if (fairIds && fairEngines.length !== fairIds.length) throw new Error(`Unknown engine in --fair-engines: ${fairIds.join(",")}`);

	type Played = { m: Mix; s: Setting; fair: boolean; verdicts: Record<string, Verdict[]>; texts: Record<string, string> };
	const played: Played[] = [];
	for (const { m, s } of jobs) {
		const verdicts: Record<string, Verdict[]> = {};
		const texts: Record<string, string> = {};
		let complete = true, fair = true;
		for (const e of engines) {
			const r = cache[keyOf(e, m, s)] as Cached | undefined;
			if (!r || (r.error && !r.error.startsWith("dropped"))) {
				complete = false;
				break;
			}
			texts[e.id] = r.error ? "" : r.text;
			verdicts[e.id] = scoreHalves(m.parts, texts[e.id]).map(verdictOf);
		}
		for (const e of fairEngines)
			for (const p of m.parts) {
				const c = clipById.get(p.clip);
				if (!c || (soloRecall(e, c) ?? 0) < THROUGH) fair = false;
			}
		if (complete) played.push({ m, s, fair, verdicts, texts });
	}

	writeReport(played, engines, kinds);
}

// ---------------------------------------------------------------------------
// Report

const SETTING_NAME: Record<Setting, string> = { both: "Both languages selected", en: "English only selected", auto: "Auto-detect" };
const LANG: Record<string, string> = { en: "English", de: "German", es: "Spanish", fr: "French", ar: "Arabic", hi: "Hindi", zh: "Mandarin" };

function writeReport(played: { m: Mix; s: Setting; fair: boolean; verdicts: Record<string, Verdict[]>; texts: Record<string, string> }[], engines: EngineAdapter[], kinds: Kind[]) {
	const date = new Date().toISOString().slice(0, 10);
	const dir = resolve(ROOT, "results", `${date}-codeswitch`);
	mkdirSync(dir, { recursive: true });
	const pct = (a: number, b: number) => (b ? `${Math.round((100 * a) / b)}%` : "–");
	const cell = (a: number, b: number) => (b ? `${a} of ${b} (${pct(a, b)})` : "–");
	const out: string[] = [`# Two languages in one recording — ${date}`, ""];
	out.push("A recording counts only if every engine gets each half right when that clip is played alone, so a lost language is caused by the switch.", "");
	const agg: Record<string, unknown> = {};

	for (const kind of kinds) {
		const title = kind === "english" ? "English plus another language" : "Two languages, neither English";
		out.push(`## ${title}`, "");
		const settings = SETTINGS_FOR[kind].filter((s) => played.some((p) => p.m.kind === kind && p.s === s));
		if (!settings.length) {
			out.push("Not run yet.", "");
			continue;
		}
		out.push(`| Language setting | Fair recordings | ${engines.map((e) => e.label).join(" | ")} |`, `|---|---|${engines.map(() => "---|").join("")}`);
		for (const s of settings) {
			const fair = played.filter((p) => p.m.kind === kind && p.s === s && p.fair);
			const row = engines.map((e) => {
				const n = fair.filter((p) => p.verdicts[e.id].some(lost)).length;
				const enLost = fair.filter((p) => p.m.parts.some((q, k) => q.language === "en" && lost(p.verdicts[e.id][k]))).length;
				const otherLost = fair.filter((p) => p.m.parts.some((q, k) => q.language !== "en" && lost(p.verdicts[e.id][k]))).length;
				const firstLost = fair.filter((p) => lost(p.verdicts[e.id][0])).length;
				const secondLost = fair.filter((p) => lost(p.verdicts[e.id][1])).length;
				agg[`${kind}/${s}/${e.id}`] = { fair: fair.length, languageLost: n, englishLost: enLost, otherLost, firstLost, secondLost };
				return cell(n, fair.length);
			});
			out.push(`| ${SETTING_NAME[s]} | ${fair.length} | ${row.join(" | ")} |`);
		}
		out.push("", "Share of fair recordings where one language was lost (under 20% of its words in the transcript).", "");

		if (kind === "english") {
			out.push("### Which half was lost", "", `| Setting | Engine | English lost | Other language lost | First half lost | Second half lost |`, "|---|---|---|---|---|---|");
			for (const s of settings)
				for (const e of engines) {
					const a = agg[`${kind}/${s}/${e.id}`] as { fair: number; englishLost: number; otherLost: number; firstLost: number; secondLost: number };
					out.push(`| ${SETTING_NAME[s]} | ${e.label} | ${cell(a.englishLost, a.fair)} | ${cell(a.otherLost, a.fair)} | ${cell(a.firstLost, a.fair)} | ${cell(a.secondLost, a.fair)} |`);
				}
			out.push("");
		}

		const byLang = new Map<string, typeof played>();
		for (const p of played.filter((x) => x.m.kind === kind && x.fair && x.s === settings[0])) {
			const key = kind === "english" ? LANG[p.m.parts.find((q) => q.language !== "en")!.language] : p.m.parts.map((q) => LANG[q.language]).sort().join(" + ");
			byLang.set(key, [...(byLang.get(key) ?? []), p]);
		}
		if (byLang.size) {
			out.push(`### By language (${SETTING_NAME[settings[0]]})`, "", `| Language | ${engines.map((e) => e.label).join(" | ")} |`, `|---|${engines.map(() => "---|").join("")}`);
			for (const [k, ps] of [...byLang.entries()].sort()) out.push(`| ${k} | ${engines.map((e) => cell(ps.filter((p) => p.verdicts[e.id].some(lost)).length, ps.length)).join(" | ")} |`);
			out.push("");
		}
	}
	writeFileSync(resolve(dir, "summary.md"), out.join("\n"));
	writeFileSync(resolve(dir, "codeswitch.json"), JSON.stringify({ date, engines: engines.map((e) => ({ id: e.id, label: e.label })), aggregates: agg }, null, 2));
	// Per-recording detail stays local (gitignored), like the single-language clips file.
	const local = resolve(ROOT, "cache", "clips");
	mkdirSync(local, { recursive: true });
	const rows = played.flatMap((p) =>
		engines.map((e) => ({
			recording: p.m.id, kind: p.m.kind, setting: p.s, counted: p.fair ? "yes" : "no", engine: e.id,
			first_language: p.m.parts[0].language, first_reference: p.m.parts[0].reference, first_verdict: p.verdicts[e.id][0],
			second_language: p.m.parts[1].language, second_reference: p.m.parts[1].reference, second_verdict: p.verdicts[e.id][1],
			transcript: p.texts[e.id],
		})),
	);
	writeFileSync(resolve(local, `${date}-codeswitch.tsv`), writeTsv(rows, ["recording", "kind", "setting", "counted", "engine", "first_language", "first_reference", "first_verdict", "second_language", "second_reference", "second_verdict", "transcript"]));
	console.log(`\n  ${dir}`);
}

if (require.main === module) {
	main().catch((e) => {
		console.error(e instanceof Error ? e.message : e);
		process.exit(1);
	});
}
