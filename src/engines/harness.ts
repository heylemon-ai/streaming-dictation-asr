/**
 * Plays one clip through one engine in real time: connect, feed fixed-size
 * batches paced to the clock, let the client shaper decide what is sent, end
 * the audio, then wait for the engine's final transcript.
 */

import type { Shaper } from "../audio/stream";
import type { Wav } from "../audio/wav";
import type { Connection, EngineAdapter, TranscribeResult } from "./types";

export type PlayOptions = {
	language: string;
	languageOptions?: string[];
	prompt?: string;
	/** 1 = real time. Faster playback changes how engines with their own end-of-speech detection behave. */
	speed: number;
	feedSamples: number;
	feedIntervalMs: number;
	connectTimeoutMs?: number;
	sampleRate: number;
};

const DONE_TIMEOUT_MS = 30_000;
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export async function transcribe(engine: EngineAdapter, shaper: Shaper, wav: Wav, opts: PlayOptions): Promise<TranscribeResult> {
	const started = Date.now();
	const segments: string[] = [];
	let detectedLanguage: string | undefined;
	let firstFinalAt: number | undefined;
	let error: string | undefined;
	let resolveDone!: () => void;
	const done = new Promise<void>((r) => (resolveDone = r));

	let conn: Connection;
	try {
		conn = await Promise.race([
			engine.connect({
				language: opts.language,
				languageOptions: opts.languageOptions,
				prompt: opts.prompt,
				connectTimeoutMs: opts.connectTimeoutMs,
				onFinal: (text, lang) => {
					const t = text.trim();
					if (t) { segments.push(t); firstFinalAt ??= Date.now(); }
					if (lang) detectedLanguage = lang;
				},
				onDone: () => resolveDone(),
				onError: (e) => {
					error ??= e.message;
				},
			}),
			sleep((opts.connectTimeoutMs ?? 10_000) + 1_000).then(() => {
				throw new Error("not ready in time");
			}),
		]);
	} catch (e) {
		return blank(started, `connect: ${(e as Error).message}`);
	}
	const connectMs = Date.now() - started;

	// Paced against the clock rather than sleeping after each batch, so playback never drifts behind real time.
	const interval = opts.feedIntervalMs / Math.max(0.01, opts.speed);
	const feedStart = Date.now();
	const audioMs = wav.durationMs;
	for (let off = 0, n = 0; off < wav.samples.length; off += opts.feedSamples, n++) {
		const batch = wav.samples.subarray(off, Math.min(off + opts.feedSamples, wav.samples.length));
		for (const chunk of await shaper.feed(batch)) conn.sendAudio(chunk);
		const wait = feedStart + (n + 1) * interval - Date.now();
		if (wait > 0) await sleep(wait);
	}

	if (shaper.tooShort()) {
		conn.close();
		return { ...blank(started, "dropped: too little audio passed the client to submit"), connectMs };
	}
	for (const chunk of shaper.flush()) conn.sendAudio(chunk);
	const endAt = Date.now();
	conn.endAudio();

	const finished = await Promise.race([done.then(() => true), sleep(DONE_TIMEOUT_MS).then(() => false)]);
	const doneAt = Date.now();
	conn.close();
	if (!finished) error ??= "timeout waiting for transcript";

	return {
		text: segments.join(" ").trim(),
		segments,
		detectedLanguage,
		sentAudioMs: (shaper.totalStreamedSamples / opts.sampleRate) * 1000,
		connectMs,
		latencyMs: finished ? doneAt - endAt : 0,
		firstFinalMs: firstFinalAt != null ? firstFinalAt - feedStart : undefined,
		firstFinalBeforeEnd: firstFinalAt != null ? firstFinalAt < endAt : undefined,
		audioMs,
		totalMs: doneAt - started,
		error,
	};
}

function blank(started: number, error: string): TranscribeResult {
	return { text: "", segments: [], sentAudioMs: 0, connectMs: 0, latencyMs: 0, totalMs: Date.now() - started, error };
}
