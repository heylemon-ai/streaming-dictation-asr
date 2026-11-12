/**
 * Imports a past run from a per-clip CSV (columns: clip, engine, hypothesis,
 * latency_ms, connect_ms, sent_audio_ms, detected_language, error) into its own
 * cache, so it can be rescored and reported without calling any engine.
 *
 *   npm run import-run -- --from <file.csv> --cache oct1 --at 2026-10-01 [--engines qwen,whisper]
 *   npm run report -- --cache oct1 --label oct1
 *
 * The run must have used the same clips (matched by clip id and audio), real-time
 * playback and the client profile in config/client-profile.json. Clips not in
 * the current manifest are skipped and counted.
 */

import { config } from "dotenv";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { cacheKey, loadCache, profileHash, saveCache, type Cached } from "../src/cache";
import { ENGINES } from "../src/engines";
import { readManifest } from "../src/manifest";
import { loadProfile, ROOT } from "../src/profile";

config({ path: resolve(ROOT, ".env"), quiet: true });

const arg = (n: string) => {
	const i = process.argv.indexOf(`--${n}`);
	return i >= 0 ? process.argv[i + 1] : undefined;
};
const from = arg("from");
const cacheName = arg("cache");
const at = arg("at");
if (!from || !cacheName || !at) {
	console.error("Usage: npm run import-run -- --from <file.csv> --cache <name> --at <YYYY-MM-DD> [--engines a,b]");
	process.exit(1);
}
const wantEngines = arg("engines")?.split(",");

function parseCsv(text: string): string[][] {
	const rows: string[][] = [];
	let row: string[] = [], field = "", quoted = false;
	for (let k = 0; k < text.length; k++) {
		const c = text[k];
		if (quoted) {
			if (c === '"' && text[k + 1] === '"') { field += '"'; k++; }
			else if (c === '"') quoted = false;
			else field += c;
		} else if (c === '"') quoted = true;
		else if (c === ",") { row.push(field); field = ""; }
		else if (c === "\n" || c === "\r") {
			if (c === "\r" && text[k + 1] === "\n") k++;
			row.push(field); field = "";
			if (row.some((f) => f !== "")) rows.push(row);
			row = [];
		} else field += c;
	}
	if (field || row.length) { row.push(field); rows.push(row); }
	return rows;
}

const csv = parseCsv(readFileSync(from, "utf-8"));
const rows = csv.slice(1).map((r) => Object.fromEntries(csv[0].map((h, k) => [h, r[k] ?? ""])));
const profile = loadProfile();
const pHash = (id: string) => profileHash(profile, id);
const clips = new Map(readManifest().map((c) => [c.id, c]));
const cache = loadCache(cacheName);

const counts: Record<string, { imported: number; skipped: number }> = {};
for (const r of rows) {
	const engine = ENGINES.find((e) => e.id === r.engine);
	if (!engine || (wantEngines && !wantEngines.includes(engine.id))) continue;
	const n = (counts[engine.id] ??= { imported: 0, skipped: 0 });
	const clip = clips.get(r.clip);
	if (!clip) {
		n.skipped++;
		continue;
	}
	// The earlier harness called a client-side drop "discarded"; this benchmark calls it "dropped".
	const error = r.error ? r.error.replace(/^discarded:.*/, "dropped: too little audio passed the client to submit") : undefined;
	const entry: Cached = {
		text: r.hypothesis ?? "",
		segments: r.hypothesis ? [r.hypothesis] : [],
		detectedLanguage: r.detected_language || undefined,
		sentAudioMs: Number(r.sent_audio_ms) || 0,
		connectMs: Number(r.connect_ms) || 0,
		latencyMs: Number(r.latency_ms) || 0,
		totalMs: 0,
		error,
		at: `${at}T00:00:00.000Z`,
		model: engine.model(),
		importedFrom: from.split("/").pop(),
	};
	const key = cacheKey({
		engine: engine.id,
		model: engine.model(),
		variant: engine.variant,
		file: clip.file,
		language: clip.language,
		speed: 1,
		gated: profile.vadGate.enabledFor.includes(engine.id),
		profile: pHash(engine.id),
		run: 0,
	});
	cache[key] = entry;
	n.imported++;
}
saveCache(cache, cacheName);
for (const [e, n] of Object.entries(counts)) console.log(`  ${e.padEnd(8)} ${n.imported} imported, ${n.skipped} skipped (clip not in manifest)`);
console.log(`  → cache/${cacheName}.json`);
