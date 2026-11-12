/**
 * Sanity check: compares two caches on the clips both contain, per engine.
 * Use it to confirm a new run agrees with an earlier one before relying on the
 * earlier results.
 *
 *   npm run compare-runs -- --a oct1 --b results
 *
 * Prints, per engine: clips compared, error rate in each run on those clips,
 * share of clips with identical normalized transcripts, and median wait.
 */

import { config } from "dotenv";
import { resolve } from "node:path";
import { cacheKey, loadCache, profileHash } from "../src/cache";
import { ENGINES } from "../src/engines";
import { readManifest } from "../src/manifest";
import { loadProfile, ROOT } from "../src/profile";
import { normalize, rate, scoreClip } from "../src/score";
import { percentile } from "../src/stats";

config({ path: resolve(ROOT, ".env"), quiet: true });
const arg = (n: string) => {
	const i = process.argv.indexOf(`--${n}`);
	return i >= 0 ? process.argv[i + 1] : undefined;
};
const a = loadCache(arg("a") ?? "oct1"), b = loadCache(arg("b") ?? "results");
const profile = loadProfile();
const pHash = (id: string) => profileHash(profile, id);
const clips = readManifest();

console.log(`${"engine".padEnd(9)} ${"clips".padStart(5)}  ${"rate A".padStart(7)}  ${"rate B".padStart(7)}  ${"same text".padStart(9)}  ${"wait A".padStart(7)}  ${"wait B".padStart(7)}`);
for (const e of ENGINES) {
	const pairs = clips
		.map((c) => {
			const k = cacheKey({ engine: e.id, model: e.model(), variant: e.variant, file: c.file, language: c.language, speed: 1, gated: profile.vadGate.enabledFor.includes(e.id), profile: pHash(e.id), run: 0 });
			return { c, x: a[k], y: b[k] };
		})
		.filter((p) => p.x && p.y && p.c.reference.trim() && !(p.x.error && !p.x.error.startsWith("dropped")) && !(p.y.error && !p.y.error.startsWith("dropped")));
	if (!pairs.length) continue;
	const txt = (r: { text: string; error?: string }) => (r.error ? "" : r.text);
	const ra = rate(pairs.map((p) => scoreClip(p.c.reference, txt(p.x), p.c.language).headline));
	const rb = rate(pairs.map((p) => scoreClip(p.c.reference, txt(p.y), p.c.language).headline));
	const same = pairs.filter((p) => normalize(txt(p.x), p.c.language) === normalize(txt(p.y), p.c.language)).length / pairs.length;
	const wa = percentile(pairs.filter((p) => !p.x.error).map((p) => p.x.latencyMs), 0.5);
	const wb = percentile(pairs.filter((p) => !p.y.error).map((p) => p.y.latencyMs), 0.5);
	const pc = (v: number) => `${(v * 100).toFixed(1)}%`;
	console.log(`${e.id.padEnd(9)} ${String(pairs.length).padStart(5)}  ${pc(ra).padStart(7)}  ${pc(rb).padStart(7)}  ${pc(same).padStart(9)}  ${String(wa).padStart(7)}  ${String(wb).padStart(7)}`);
}
