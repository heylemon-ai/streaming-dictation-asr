/**
 * The results cache: one JSON file per cache name under cache/ (default
 * "results"). Keys cover everything that can change a transcript, so a rerun
 * only plays what changed. Separate cache names keep separate runs apart, for
 * example an imported historical run.
 */

import { createHash } from "node:crypto";
import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { TranscribeResult } from "./engines/types";
import { DATA_DIR } from "./manifest";
import type { ClientProfile } from "./profile";
import { ROOT } from "./profile";

export type Cached = TranscribeResult & { at: string; model: string; importedFrom?: string };

const pathOf = (name: string) => resolve(ROOT, "cache", `${name}.json`);

export function loadCache(name = "results"): Record<string, Cached> {
	const p = pathOf(name);
	return existsSync(p) ? JSON.parse(readFileSync(p, "utf-8")) : {};
}

/** Several caches read as one, for reports that combine runs ("oct1,results"). Earlier names win on conflicts. */
export function loadCaches(names: string): Record<string, Cached> {
	const out: Record<string, Cached> = {};
	// Earlier names win, except that a successful result always beats a failed one, so a retry kept in a
	// separate cache is not hidden by the failed attempt in another.
	for (const n of names.split(",").reverse())
		for (const [k, v] of Object.entries(loadCache(n.trim()))) if (!out[k] || !v.error || out[k].error) out[k] = v;
	return out;
}

/** Merge with what is on disk, then swap the file in, so two runs at once never overwrite each other. */
export function saveCache(c: Record<string, Cached>, name = "results"): void {
	mkdirSync(resolve(ROOT, "cache"), { recursive: true });
	for (const [k, v] of Object.entries(loadCache(name))) if (!c[k] || (c[k].error && !v.error)) c[k] = v;
	const tmp = `${pathOf(name)}.${process.pid}.tmp`;
	writeFileSync(tmp, JSON.stringify(c));
	renameSync(tmp, pathOf(name));
}

const hashes = new Map<string, string>();
export function audioHash(file: string): string {
	let h = hashes.get(file);
	if (!h) hashes.set(file, (h = createHash("sha1").update(readFileSync(resolve(DATA_DIR, file))).digest("hex")));
	return h;
}

/**
 * Hash of the client settings that change what one engine receives: the shared
 * feed, minimum length and VAD gate, plus that engine's own audio format.
 * Other engines' entries are left out, so adding or changing one engine's audio
 * settings never invalidates another engine's cached results.
 */
export function profileHash(p: ClientProfile, engineId: string): string {
	const { feed, minStreamMs, vadGate } = p;
	return createHash("sha1").update(JSON.stringify({ feed, minStreamMs, vadGate, engineAudio: p.engineAudio[engineId] ?? null })).digest("hex").slice(0, 10);
}

/** The earlier, whole-profile hash. Used only to migrate old cache keys. */
export function legacyProfileHash(p: Pick<ClientProfile, "feed" | "minStreamMs" | "vadGate" | "engineAudio">): string {
	const { feed, minStreamMs, vadGate, engineAudio } = p;
	return createHash("sha1").update(JSON.stringify({ feed, minStreamMs, vadGate, engineAudio })).digest("hex").slice(0, 10);
}

export function cacheKey(k: { engine: string; model: string; variant?: string; file: string; language: string; speed: number; gated: boolean; profile: string; run: number }): string {
	const parts: (string | number)[] = [k.engine, k.model, audioHash(k.file), k.language, k.speed, k.gated ? `gate:${k.profile}` : "nogate", k.run];
	if (k.variant) parts.push(`variant:${k.variant}`);
	return createHash("sha256")
		.update(parts.join("\u0000"))
		.digest("hex")
		.slice(0, 32);
}
