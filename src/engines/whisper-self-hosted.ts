/**
 * Whisper Large V3 on our own Baseten deployment (TensorRT-LLM, "whisper-large-v3-trtllm-stream").
 *
 * Same init message, binary PCM audio and result events as the Baseten Whisper adapter
 * (baseten.ts), but the deployment does no splitting of its own: it buffers audio until the
 * client sends {"type":"segment_flush"} (transcribe everything since the last flush as one
 * segment) or {"type":"end_audio"} (transcribe the rest, wait for every pending segment, send
 * finished, close). A segment can be at most 30 s (the deployment's limit since 2026-10-20;
 * it was ~10.2 s before), so the client must flush.
 *
 * The client flushes where the client VAD finds a sentence boundary (Silero VAD,
 * threshold 0.5, a pause of 544 ms after speech, at least 5 s since the last flush). Past
 * SOFT_SEGMENT it flushes at the first non-speech window, and it forces a flush at MAX_SEGMENT.
 *
 * Every sample is sent: the VAD only decides where segments end; it never holds back audio.
 * The -vad versions also put the client's VAD gate in front and drop what it judges non-speech.
 *
 * The VAD is Silero (as in the gated setup) or TEN VAD (src/audio/tenvad.ts); the same model drives both
 * the flush decisions and, in the -vad versions, the gate. Silero versions keep their original
 * ids and cache variants.
 */

import { WebSocket } from "ws";
import { SileroVad, VadGate } from "../audio/vad";
import { TenVad } from "../audio/tenvad";
import { loadProfile } from "../profile";
import type { ConnectOptions, Connection, EngineAdapter } from "./types";

const RATE = 16000;
const WINDOW = 512; // 32 ms, Silero's window
const MS_PER_WINDOW = (WINDOW / RATE) * 1000;
const THRESHOLD = 0.5;
const PAUSE_MS = 544;
const MIN_SEGMENT = RATE * 5;
const SOFT_SEGMENT = RATE * 25; // past this, flush at the first non-speech window
const MAX_SEGMENT = RATE * 29.5; // under the deployment's 30 s limit

type RawEvent = { type: string; is_final?: boolean; segments?: { text: string }[]; language_code?: string; message?: string; body?: { status?: string } };

type VadKind = "silero" | "ten";
const freshVad = async (k: VadKind) => (k === "ten" ? TenVad.fresh() : SileroVad.fresh());

async function connect(o: ConnectOptions, dropAudio = false, kind: VadKind = "silero", gateThreshold?: number): Promise<Connection> {
	const apiKey = process.env.BASETEN_API_KEY, modelId = process.env.BASETEN_WHISPER_SELF_HOSTED_MODEL_ID;
	if (!apiKey || !modelId) throw new Error("BASETEN_API_KEY and BASETEN_WHISPER_SELF_HOSTED_MODEL_ID must be set");
	const vad = await freshVad(kind);
	// The audio-dropping variant puts the client's VAD gate (the same VadGate the benchmark uses for
	// Whisper) in front: audio the gate judges to be non-speech is never sent.
	const profile = loadProfile();
	const gateVad = dropAudio ? await freshVad(kind) : null;
	// gateThreshold overrides only the drop decision (the threshold sweep); pause detection stays at THRESHOLD.
	const gateProfile = gateThreshold == null ? profile.vadGate : { ...profile.vadGate, threshold: gateThreshold };
	const gate = gateVad ? new VadGate(gateVad as SileroVad, gateProfile, WINDOW, (profile.minStreamMs / 1000) * RATE) : null;
	const closeVads = () => { for (const v of [vad, gateVad]) if (v instanceof TenVad) v.close(); };
	const url = `wss://model-${modelId}.api.baseten.co/environments/production/websocket`;

	return new Promise((resolve, reject) => {
		const ws = new WebSocket(url, { headers: { Authorization: `Api-Key ${apiKey}` } });
		let opened = false, done = false;
		let inSegment = 0, inSpeech = false, silence = 0;
		let pending: number[] = []; // samples waiting for a full VAD window
		const emit = (w: number[]) => {
			send(Buffer.from(Int16Array.from(w).buffer));
			inSegment += w.length;
		};
		let queue = Promise.resolve(); // VAD and sends stay in order
		const send = (m: Buffer | string) => ws.readyState === WebSocket.OPEN && ws.send(m);
		const flush = () => {
			if (inSegment > 0) send(JSON.stringify({ type: "segment_flush" }));
			inSegment = 0;
		};
		const finish = () => {
			if (done) return;
			done = true;
			closeVads();
			o.onDone();
			ws.close(1000, "done");
		};
		const timer = setTimeout(() => {
			if (!opened) {
				ws.terminate();
				closeVads();
				reject(new Error("connection timed out"));
			}
		}, o.connectTimeoutMs ?? 5_000);

		ws.on("open", () => {
			clearTimeout(timer);
			const params: Record<string, unknown> = { audio_language: o.language && o.language !== "auto" ? o.language : "auto", use_dynamic_preprocessing: true, whisper_sampling_params: { beam_width: 5 } };
			if (o.prompt) params.prompt = o.prompt;
			if (o.languageOptions?.length) params.language_options = o.languageOptions;
			send(JSON.stringify({ streaming_params: { encoding: "pcm_s16le", sample_rate: RATE, enable_partial_transcripts: false }, whisper_params: params }));
			opened = true;
			resolve({
				sendAudio(chunk) {
					queue = queue.then(async () => {
						await take(chunk);
					});
				},
				endAudio() {
					queue = queue.then(async () => {
						if (pending.length) await send1(pending.splice(0));
						if (gate) for (const c of gate.flush()) emit(Array.from(new Int16Array(c.buffer, c.byteOffset, c.length / 2)));
						send(JSON.stringify({ type: "end_audio" }));
					});
				},
				close() {
					if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) ws.close(1000, "done");
				},
			});
			// Pause decisions come from the original audio; with the gate, only what it lets through
			// is sent. Its pauses are therefore the same ones the client's gate closes on.
			async function send1(w: number[]) {
				if (!gate) return emit(w);
				for (const c of await gate.feed(Float32Array.from(w, (x) => x / 32767))) emit(Array.from(new Int16Array(c.buffer, c.byteOffset, c.length / 2)));
			}
			async function take(chunk: Buffer) {
						for (const v of new Int16Array(chunk.buffer, chunk.byteOffset, chunk.length / 2)) pending.push(v);
						while (pending.length >= WINDOW) {
							const w = pending.splice(0, WINDOW);
							const speech = (await vad.predict(Float32Array.from(w, (x) => x / 32767))) >= THRESHOLD;
							await send1(w);
							if (speech) {
								inSpeech = true;
								silence = 0;
							} else if (inSpeech && ++silence * MS_PER_WINDOW >= PAUSE_MS) {
								inSpeech = false;
								silence = 0;
								if (inSegment >= MIN_SEGMENT) flush();
							}
							if (!speech && inSegment >= SOFT_SEGMENT) flush();
							if (inSegment >= MAX_SEGMENT) flush();
						}
			}
		});
		ws.on("message", (data: Buffer) => {
			let p: RawEvent;
			try {
				p = JSON.parse(data.toString());
			} catch {
				return;
			}
			if (p.type === "end_audio") {
				if (p.body?.status === "finished") finish();
				return;
			}
			if (p.type === "error") {
				o.onError(new Error(p.message ?? JSON.stringify(p)));
				return;
			}
			if (p.type === "transcription" && p.is_final) {
				const text = p.segments?.map((x) => x.text).join(" ").trim();
				if (text) o.onFinal(text, p.language_code);
			}
		});
		ws.on("error", (err) => {
			clearTimeout(timer);
			if (!opened) {
				closeVads();
				reject(err);
			}
			else o.onError(err);
		});
		ws.on("close", (code, reason) => {
			clearTimeout(timer);
			if (!opened) {
				closeVads();
				reject(new Error(`closed before open: ${code} ${reason.toString()}`));
			}
			else finish();
		});
	});
}

export const whisperSelfHosted: EngineAdapter = {
	id: "whisper-self-hosted",
	label: "Whisper Self-Hosted",
	model: () => `baseten:${process.env.BASETEN_WHISPER_SELF_HOSTED_MODEL_ID ?? "?"}`,
	variant: "flush-v4",
	env: ["BASETEN_API_KEY", "BASETEN_WHISPER_SELF_HOSTED_MODEL_ID"],
	supportsLanguage: () => true,
	connect: (o) => connect(o),
};

/** Same deployment with the client's VAD gate in front, dropping audio it judges to be non-speech. */
export const whisperSelfHostedVad: EngineAdapter = {
	...whisperSelfHosted,
	id: "whisper-self-hosted-vad",
	label: "Whisper Self-Hosted (VAD drops audio)",
	variant: "flush-v4-gate2",
	connect: (o) => connect(o, true),
};

/** TEN VAD in place of Silero: flush decisions only, every sample sent. */
export const whisperSelfHostedTen: EngineAdapter = {
	...whisperSelfHosted,
	id: "whisper-self-hosted-ten",
	label: "Whisper Self-Hosted (TEN VAD)",
	variant: "flush-v4-ten1",
	connect: (o) => connect(o, false, "ten"),
};

/** TEN VAD in place of Silero, with the client's gate in front, dropping what TEN judges to be non-speech. */
export const whisperSelfHostedTenVad: EngineAdapter = {
	...whisperSelfHosted,
	id: "whisper-self-hosted-ten-vad",
	label: "Whisper Self-Hosted (TEN VAD drops audio)",
	variant: "flush-v4-ten1-gate2",
	connect: (o) => connect(o, true, "ten"),
};

/** Threshold sweep of the audio-dropping versions: the same rules with a lower speech threshold for the drop
 *  decision. 0.5 is the versions above; these add 0.2, 0.3 and 0.4 for Silero and TEN. */
export const whisperSelfHostedSweep: EngineAdapter[] = (["silero", "ten"] as const).flatMap((kind) =>
	[0.2, 0.3, 0.4].map((t) => ({
		...whisperSelfHosted,
		id: `whisper-self-hosted-${kind === "ten" ? "ten-" : ""}vad-t${String(t).replace(".", "")}`,
		label: `Whisper Self-Hosted (${kind === "ten" ? "TEN" : "Silero"} drops audio, threshold ${t})`,
		variant: `${kind === "ten" ? "flush-v4-ten1-gate" : "flush-v4-gate2"}-t${t}`,
		connect: (o: ConnectOptions) => connect(o, true, kind, t),
	})),
);
