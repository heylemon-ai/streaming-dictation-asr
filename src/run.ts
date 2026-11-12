/**
 * Runs every chosen clip through every chosen engine in real time, then scores
 * and reports.
 *
 *   npm run run                                     # every engine with keys set, every set
 *   npm run run -- --engines gemini,meta --sets en-dictation,nonspeech
 *   npm run run -- --limit 3                        # smoke test: 3 clips per set
 *   npm run run -- --runs 3                         # repeat each clip 3 times (latency spread)
 *   npm run run -- --language auto                  # engine detects the language
 *   npm run run -- --no-gate                        # skip the client VAD gate
 *   npm run report                                  # rebuild the report from the cache
 *
 * Options: --concurrency N (default 6), --gap MS (pause between clips per session),
 * --speed N (1 = real time),
 * --connect-timeout MS, --label NAME (suffix for the results folder),
 * --cache NAME (use cache/NAME.json, e.g. an imported run; with --report-only,
 * a comma list such as "oct1,results" combines runs), --force.
 *
 * Results are cached in cache/results.json (or --cache NAME), keyed on everything that can change
 * a transcript, so a rerun only pays for what changed.
 */

import { config } from "dotenv";
import { resolve } from "node:path";
import { readWav } from "./audio/wav";
import { cacheKey, loadCache, loadCaches, profileHash, saveCache } from "./cache";
import { ENGINES, shaperFor } from "./engines";
import { transcribe } from "./engines/harness";
import type { EngineAdapter } from "./engines/types";
import { DATA_DIR, readManifest, readSets, type Clip } from "./manifest";
import { loadProfile, ROOT } from "./profile";
import { writeResults, type RunRecord } from "./report";

config({ path: resolve(ROOT, ".env"), quiet: true });

/** Errors that mean "try again later", not a failed transcript. */
const RETRYABLE = /rate limit|too many concurrent|ENOTFOUND|ECONNRESET|ETIMEDOUT|EAI_AGAIN/i;

const arg = (n: string) => {
	const i = process.argv.indexOf(`--${n}`);
	return i >= 0 ? process.argv[i + 1] : undefined;
};
const flag = (n: string) => process.argv.includes(`--${n}`);

async function main() {
	const profile = loadProfile();
	const opts = {
		language: arg("language") === "auto" ? "auto" : arg("language") === "regional" ? "regional" : "clip",
		speed: Number(arg("speed") ?? 1),
		gate: !flag("no-gate"),
		runs: Math.max(1, Number(arg("runs") ?? 1)),
	};
	const pHash = (id: string) => profileHash(profile, id);
	// --language regional sends each set's own locale (e.g. ar-SA for Najdi and Hijazi Arabic) instead of the bare
	// language; adapters fall back to the bare language when a system has no such locale.
	const REGION_TAG: Record<string, string> = { "ar-eg": "ar-EG", "ar-sa": "ar-SA", "ar-ae": "ar-AE", "es-419": "es-419", "es-es": "es-ES", "es-pr": "es-PR" };
	const sendLanguage = (c: Clip) => (opts.language === "auto" ? "auto" : opts.language === "regional" ? REGION_TAG[c.set] ?? c.language : c.language);
	const cacheArg = arg("cache") ?? "results";
	if (cacheArg.includes(",") && !flag("report-only")) throw new Error("Several caches can only be combined with --report-only.");
	const cacheName = cacheArg;

	const sets = readSets();
	const wantSets = arg("sets")?.split(",");
	const unknown = (wantSets ?? []).filter((s) => !sets.some((x) => x.id === s));
	if (unknown.length) throw new Error(`Unknown set(s): ${unknown.join(", ")}`);
	const limit = Number(arg("limit") ?? 0);
	let clips = readManifest().filter((c) => !wantSets || wantSets.includes(c.set));
	if (limit) {
		const seen: Record<string, number> = {};
		clips = clips.filter((c) => (seen[c.set] = (seen[c.set] ?? 0) + 1) <= limit);
	}

	const wantEngines = arg("engines")?.split(",");
	const engines: EngineAdapter[] = ENGINES.filter((e) => !wantEngines || wantEngines.includes(e.id)).filter((e) => {
		if (flag("report-only")) return true;
		const missing = e.env.filter((k) => !process.env[k]);
		if (missing.length) console.log(`  skipping ${e.id}: ${missing.join(", ")} not set`);
		return !missing.length;
	});
	// A Baseten deployment that is switched off answers every connection with 404.
	// Ask Baseten once and skip the engine with a clear message instead of failing every clip.
	if (!flag("report-only")) {
		for (const e of [...engines]) {
			if (e.id !== "whisper" && e.id !== "qwen") continue;
			const id = e.id === "whisper" ? process.env.BASETEN_WHISPER_MODEL_ID : process.env.BASETEN_QWEN_MODEL_ID;
			try {
				const r = await fetch(`https://api.baseten.co/v1/models/${id}/deployments/production`, {
					headers: { Authorization: `Api-Key ${process.env.BASETEN_API_KEY}` },
				});
				const d = (await r.json()) as { status?: string };
				// A scaled-to-zero deployment wakes on the first request; its first sessions may fail and are rerun.
				if (r.ok && (d.status === "SCALED_TO_ZERO" || d.status === "WAKING_UP")) {
					console.log(`  ${e.id}: Baseten deployment is ${d.status}; it wakes on the first request, so early clips may fail and need a rerun.`);
					continue;
				}
				if (!r.ok || d.status !== "ACTIVE") {
					console.log(`  skipping ${e.id}: Baseten deployment is ${r.ok ? d.status : `not found (${r.status})`}. Activate it in Baseten, then rerun.`);
					engines.splice(engines.indexOf(e), 1);
				}
			} catch {
				// Management API unreachable: try the run and let connections report.
			}
		}
	}
	if (!engines.length && !flag("report-only")) throw new Error("No engine is ready to run. See the messages above and .env.example.");

	const keyOf = (e: EngineAdapter, c: Clip, run: number) =>
		cacheKey({
			engine: e.id,
			model: e.model(),
			variant: e.variant,
			file: c.file,
			language: sendLanguage(c),
			speed: opts.speed,
			gated: opts.gate && profile.vadGate.enabledFor.includes(e.id),
			profile: pHash(e.id),
			run,
		});

	const cache = flag("force") ? {} : cacheArg.includes(",") ? loadCaches(cacheArg) : loadCache(cacheName);
	const jobs = engines.flatMap((e) => clips.flatMap((c) => Array.from({ length: opts.runs }, (_, run) => ({ e, c, run, key: keyOf(e, c, run) }))));
	// Settled results are not rerun: successes, client drops, and timeouts on non-speech
	// clips with no text (some engines never close the session when nothing was heard,
	// and "no text" is the correct outcome there). Other failures are retried.
	const settled = (j: (typeof jobs)[number]) => {
		const r = cache[j.key];
		if (!r) return false;
		if (!r.error || r.error.startsWith("dropped")) return true;
		return !j.c.reference.trim() && r.error.startsWith("timeout") && !r.text.trim();
	};
	const todo = flag("report-only") ? [] : jobs.filter((j) => !settled(j));
	const concurrency = Number(arg("concurrency") ?? 6);
	const gapMs = Number(arg("gap") ?? 0);
	console.log(`${clips.length} clips × ${engines.map((e) => e.id).join(", ") || "(none)"} × ${opts.runs} run(s): ${jobs.length - todo.length} cached, ${todo.length} to run`);
	console.log(`  client profile: ${profile.source}`);

	let next = 0, done = 0, failed = 0;
	const started = Date.now();
	const worker = async () => {
		while (next < todo.length) {
			const j = todo[next++];
			const wav = readWav(resolve(DATA_DIR, j.c.file));
			// Providers that limit sessions are retried with growing waits.
			let r!: Awaited<ReturnType<typeof transcribe>>;
			for (const wait of [0, 5_000, 15_000, 30_000, 60_000]) {
				if (wait) await new Promise((ok) => setTimeout(ok, wait));
				const { shaper, sampleRate } = await shaperFor(j.e.id, profile, opts.gate);
				r = await transcribe(j.e, shaper, wav, {
					language: sendLanguage(j.c),
					speed: opts.speed,
					feedSamples: profile.feed.samples,
					feedIntervalMs: profile.feed.intervalMs,
					connectTimeoutMs: arg("connect-timeout") ? Number(arg("connect-timeout")) : undefined,
					sampleRate,
				});
				if (!r.error || !RETRYABLE.test(r.error)) break;
			}
			if (gapMs) await new Promise((ok) => setTimeout(ok, gapMs));
			cache[j.key] = { ...r, at: new Date().toISOString(), model: j.e.model() };
			done++;
			if (r.error) {
				failed++;
				console.log(`  ✗ ${j.e.id} ${j.c.id}: ${r.error}`);
			}
			if (done % 10 === 0 || done === todo.length) {
				saveCache(cache, cacheName);
				console.log(`  ${done}/${todo.length} (${failed} failed, ${Math.round((Date.now() - started) / 1000)}s)`);
			}
		}
	};
	await Promise.all(Array.from({ length: Math.min(concurrency, todo.length) }, worker));
	if (todo.length) saveCache(cache, cacheName);

	const records: RunRecord[] = jobs
		.filter((j) => cache[j.key])
		.map((j) => ({ engine: j.e.id, engineLabel: j.e.label, run: j.run, clip: j.c, result: cache[j.key], model: cache[j.key].model }));
	const out = writeResults(records, {
		label: arg("label"),
		options: { language: opts.language, speed: opts.speed, gate: opts.gate, runs: opts.runs, clientProfile: profile.source },
		sets,
	});
	console.log(`\n  ${out}`);
}

main().catch((e) => {
	console.error(e instanceof Error ? e.message : e);
	process.exit(1);
});
