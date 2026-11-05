/**
 * The client profile: how the simulated client shapes audio before an engine sees it.
 *
 * config/client-profile.json holds the published test-client settings.
 * config/client-profile.local.json, if present and gitignored,
 * overrides it for experiments.
 */

import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

export type VadGateProfile = {
	/** Engine ids that sit behind the gate. Empty means no engine is gated. */
	enabledFor: string[];
	/** Speech probability at or above which a window counts as speech. */
	threshold: number;
	/** Silence after speech that closes the gate. */
	silenceDetectionMs: number;
	/** Longest pause sent when speech resumes. */
	maxPauseSentMs: number;
	/** Windows of audio kept from just before speech starts. */
	leadInWindows: number;
	/** If set, once this much audio has streamed, a closing pause is sent so the engine sees a boundary. */
	boundaryFlushAfterMs?: number | null;
};

export type ClientProfile = {
	feed: { samples: number; intervalMs: number };
	minStreamMs: number;
	vadGate: VadGateProfile;
	engineAudio: Record<string, { sampleRate: number; chunkSamples: number }>;
};

export const ROOT = resolve(__dirname, "..");

export function loadProfile(): ClientProfile & { source: string } {
	const local = resolve(ROOT, "config", "client-profile.local.json");
	const published = resolve(ROOT, "config", "client-profile.json");
	const path = existsSync(local) ? local : published;
	const p = JSON.parse(readFileSync(path, "utf-8")) as ClientProfile;
	return { ...p, source: path.endsWith("local.json") ? "local" : "published" };
}
