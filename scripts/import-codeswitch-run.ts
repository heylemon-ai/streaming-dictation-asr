/**
 * Imports a two-language run made with the earlier internal harness, so it can be
 * scored here without calling any engine.
 *
 *   npm run import-codeswitch-run -- --from <mix folder> --from-cache <codeswitch.json> --source-whisper "<id>" --source-gemini "<id>"
 *
 * <mix folder> holds the earlier harness's codeswitch/manifest.csv and mixes;
 * --from-cache is its codeswitch.json results cache. That harness keyed each result on
 * sha256(engine id, engine source string, sha1 of the mix audio, setting,
 * "vad" for gated engines). Each result is matched to the recording here with the
 * same id, after checking both halves are the same clips, and stored under this
 * benchmark's key. The recordings here are rebuilt from the same clips by the
 * same method.
 */

import { config } from "dotenv";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { loadCache, profileHash, saveCache, type Cached } from "../src/cache";
import { CACHE_NAME, codeswitchKey, readMixes, type Setting } from "../src/codeswitch";
import { ENGINES } from "../src/engines";
import { loadProfile, ROOT } from "../src/profile";

config({ path: resolve(ROOT, ".env"), quiet: true });
const arg = (n: string) => {
	const i = process.argv.indexOf(`--${n}`);
	return i >= 0 ? process.argv[i + 1] : undefined;
};
const from = arg("from");
const fromCache = arg("from-cache");
if (!from || !fromCache) {
	console.error("Usage: npm run import-codeswitch-run -- --from <mix folder> --from-cache <codeswitch.json> --source-<engine> <source string> ...");
	process.exit(1);
}

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

const csv = parseCsv(readFileSync(resolve(from, "codeswitch", "manifest.csv"), "utf-8"));
const oldMixes = new Map(csv.slice(1).map((r) => Object.fromEntries(csv[0].map((h, k) => [h, r[k] ?? ""]))).map((r) => [r.id, r]));
const oldCache = JSON.parse(readFileSync(fromCache, "utf-8")) as Record<string, Omit<Cached, "model">>;

const profile = loadProfile();
const pHash = (id: string) => profileHash(profile, id);
const cache = loadCache(CACHE_NAME);
const SETTINGS: Record<string, Setting[]> = { english: ["both", "en", "auto"], pair: ["both", "auto"] };

for (const e of ENGINES) {
	const source = arg(`source-${e.id}`);
	if (!source) continue;
	const gated = profile.vadGate.enabledFor.includes(e.id);
	let imported = 0, missing = 0, mismatched = 0;
	for (const m of readMixes()) {
		const old = oldMixes.get(m.id);
		if (!old || old.first_clip !== m.parts[0].clip || old.second_clip !== m.parts[1].clip) {
			mismatched++;
			continue;
		}
		const oldHash = createHash("sha1").update(readFileSync(resolve(from, old.file))).digest("hex");
		for (const s of SETTINGS[m.kind]) {
			const oldKey = createHash("sha256").update([e.id, source, oldHash, s, gated ? "vad" : ""].join("\u0000")).digest("hex").slice(0, 32);
			const r = oldCache[oldKey];
			if (!r) {
				missing++;
				continue;
			}
			const error = r.error?.replace(/^discarded:.*/, "dropped: too little audio passed the client to submit");
			cache[codeswitchKey(e, m.file, s, gated, pHash(e.id))] = { ...r, error, model: e.model(), importedFrom: "earlier harness codeswitch run" };
			imported++;
		}
	}
	console.log(`  ${e.id.padEnd(8)} ${imported} imported, ${missing} not in the earlier run, ${mismatched} recordings with different halves`);
}
saveCache(cache, CACHE_NAME);
console.log(`  → cache/${CACHE_NAME}.json`);
