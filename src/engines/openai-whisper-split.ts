/**
 * OpenAI whisper-1 with client-side splitting at pauses.
 *
 * whisper-1 only accepts complete files, so the plain upload adapter sends the whole
 * recording when the audio ends and the person waits for all of it to be transcribed.
 * This adapter cuts the recording while it streams, using the same pause rule as the
 * client VAD (Silero VAD, threshold 0.5, a pause of 544 ms after speech,
 * and at least 5 s of audio since the last cut), and uploads each finished piece at
 * once. When the audio ends only the last piece is still outstanding.
 *
 * Unlike the client's gate, no audio inside the speech is dropped: every sample up to the
 * last speech goes into some piece, so quiet speech the VAD misses still reaches the
 * model. A final piece with no speech in it is not sent, as the gated client never sends
 * trailing silence, and a recording with no speech at all sends nothing. Each piece is sent with the
 * previous piece's text as the prompt when that text has already arrived (Whisper
 * reads its prompt as the preceding transcript), so context carries across cuts
 * without making uploads wait for each other.
 */

import { writeWav16 } from "../audio/wav";
import { SileroVad } from "../audio/vad";
import type { ConnectOptions, Connection, EngineAdapter } from "./types";

const MODEL = () => process.env.OPENAI_WHISPER1_MODEL || "whisper-1";
const RATE = 16000;
const WINDOW = 512; // 32 ms, Silero's window
const MS_PER_WINDOW = (WINDOW / RATE) * 1000;
const THRESHOLD = 0.5;
const PAUSE_MS = 544;
const MIN_PIECE_SAMPLES = RATE * 5;
const MIN_TAIL_SAMPLES = RATE * 0.3; // a shorter tail is silence left over after the last cut
const PROMPT_CHARS = 800; // Whisper reads at most 224 tokens of prompt; keep the end

async function transcribe(samples: Int16Array, o: ConnectOptions, prompt?: string): Promise<string> {
	const f = new Float32Array(samples.length);
	for (let i = 0; i < samples.length; i++) f[i] = samples[i] / 32767;
	const form = new FormData();
	form.append("file", new Blob([new Uint8Array(writeWav16(f, RATE))], { type: "audio/wav" }), "audio.wav");
	form.append("model", MODEL());
	form.append("response_format", "json");
	if (o.language && o.language !== "auto") form.append("language", o.language);
	if (prompt) form.append("prompt", prompt.slice(-PROMPT_CHARS));
	const r = await fetch("https://api.openai.com/v1/audio/transcriptions", {
		method: "POST",
		headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
		body: form,
	});
	const text = await r.text();
	if (!r.ok) throw new Error(`HTTP ${r.status}: ${text.slice(0, 200)}`);
	return String(JSON.parse(text).text ?? "").trim();
}

async function connect(o: ConnectOptions): Promise<Connection> {
	if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not set");
	const vad = await SileroVad.fresh();
	let piece: number[] = []; // samples since the last cut
	let floats: number[] = []; // samples waiting for a full VAD window
	let inSpeech = false, silence = 0, closed = false;
	let speechSinceCut = false; // whether the current piece holds any speech
	const texts: (string | undefined)[] = [];
	const uploads: Promise<void>[] = [];
	let queue = Promise.resolve(); // VAD runs in order, one window at a time

	const cut = () => {
		const samples = Int16Array.from(piece);
		piece = [];
		speechSinceCut = false;
		const i = texts.length;
		texts.push(undefined);
		const prompt = i > 0 ? texts[i - 1] : undefined;
		uploads.push(transcribe(samples, o, prompt).then((t) => { texts[i] = t; }));
	};

	return {
		sendAudio(chunk) {
			const s = new Int16Array(chunk.buffer, chunk.byteOffset, chunk.length / 2);
			queue = queue.then(async () => {
				for (const v of s) {
					piece.push(v);
					floats.push(v / 32767);
				}
				while (floats.length >= WINDOW) {
					const prob = await vad.predict(Float32Array.from(floats.splice(0, WINDOW)));
					if (prob >= THRESHOLD) {
						inSpeech = true;
						speechSinceCut = true;
						silence = 0;
					} else if (inSpeech && ++silence * MS_PER_WINDOW >= PAUSE_MS) {
						inSpeech = false;
						silence = 0;
						if (piece.length >= MIN_PIECE_SAMPLES) cut();
					}
				}
			});
		},
		endAudio() {
			queue
				.then(() => {
					// Like the gated client, never send trailing silence: Whisper invents text for audio
					// with no speech ("Thank you for watching.", subtitle credits).
					// A recording in which the voice check never heard speech sends nothing.
					if (speechSinceCut && piece.length >= MIN_TAIL_SAMPLES) cut();
					return Promise.all(uploads);
				})
				.then(() => {
					const text = texts.filter(Boolean).join(" ").trim();
					if (text && !closed) o.onFinal(text);
				})
				.catch((e: Error) => o.onError(e))
				.finally(() => o.onDone());
		},
		close() {
			closed = true;
		},
	};
}

export const openaiWhisperSplit: EngineAdapter = {
	id: "openai-whisper-1-split",
	label: "OpenAI Whisper-1 (split at pauses)",
	model: MODEL,
	variant: "split-v3",
	env: ["OPENAI_API_KEY"],
	supportsLanguage: () => true,
	connect,
};
