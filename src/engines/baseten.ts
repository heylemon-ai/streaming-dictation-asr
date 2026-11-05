/**
 * Whisper Large V3 and Qwen3-ASR, each running as a streaming deployment on
 * Baseten. Both use the deployment's WebSocket endpoint; they differ in message
 * format. The settings below are the ones used for published results and are
 * listed in METHODOLOGY.md.
 */

import { WebSocket } from "ws";
import type { ConnectOptions, Connection, EngineAdapter } from "./types";

type Variant = "whisper" | "qwen";

type RawEvent = {
	type: string;
	is_final?: boolean;
	segments?: { text: string }[];
	language_code?: string;
	text?: string;
	body?: { status?: string };
	is_end_of_audio_flush?: boolean;
};

/** Server speech detection for the Qwen check of whispered speech: a lower threshold and long pauses, against the deployment's default. */
const QWEN_LOW_VAD = { threshold: 0.3, min_silence_duration_ms: 2000, speech_pad_ms: 300 };

function initMessage(variant: Variant, o: ConnectOptions, lowVad = false): Record<string, unknown> {
	const params: Record<string, unknown> = { audio_language: o.language ?? (variant === "whisper" ? "en" : "auto") };
	if (o.prompt) params.prompt = o.prompt;
	if (o.languageOptions?.length) params.language_options = o.languageOptions;
	if (variant === "whisper") {
		return {
			streaming_params: { encoding: "pcm_s16le", sample_rate: 16000, enable_partial_transcripts: false },
			streaming_vad_config: { threshold: 0.7, min_silence_duration_ms: 480, speech_pad_ms: 0 },
			whisper_params: { ...params, use_dynamic_preprocessing: true, whisper_sampling_params: { beam_width: 5 } },
		};
	}
	return { whisper_params: params, streaming_params: { enable_partial_transcripts: false }, ...(lowVad ? { streaming_vad_config: QWEN_LOW_VAD } : {}) };
}

function finalText(raw: RawEvent): { text: string; lang?: string } | null {
	if (raw.type === "transcription") {
		const text = raw.segments?.[0]?.text.trim();
		return text && raw.is_final ? { text, lang: raw.language_code } : null;
	}
	if ((raw.type === "final" || raw.type === "transcription_final") && raw.text) return { text: raw.text };
	return null;
}

function connect(variant: Variant, o: ConnectOptions, lowVad = false): Promise<Connection> {
	const apiKey = process.env.BASETEN_API_KEY;
	const modelId = variant === "whisper" ? process.env.BASETEN_WHISPER_MODEL_ID : process.env.BASETEN_QWEN_MODEL_ID;
	if (!apiKey || !modelId) return Promise.reject(new Error(`BASETEN_API_KEY and the ${variant} model id must be set`));
	const url = `wss://model-${modelId}.api.baseten.co/environments/production/websocket`;

	return new Promise((resolve, reject) => {
		const ws = new WebSocket(url, { headers: { Authorization: `Api-Key ${apiKey}` } });
		let opened = false;
		const finish = () => {
			o.onDone();
			ws.close(1000, "done");
		};
		const timer = setTimeout(() => {
			if (!opened) {
				ws.terminate();
				reject(new Error("connection timed out"));
			}
		}, o.connectTimeoutMs ?? 5_000);

		ws.on("open", () => {
			clearTimeout(timer);
			ws.send(JSON.stringify(initMessage(variant, o, lowVad)));
			opened = true;
			resolve({
				sendAudio(chunk) {
					if (ws.readyState !== WebSocket.OPEN) return;
					if (variant === "whisper") ws.send(chunk);
					else ws.send(JSON.stringify({ type: "input_audio_buffer.append", audio: chunk.toString("base64") }));
				},
				endAudio() {
					if (ws.readyState !== WebSocket.OPEN) return;
					ws.send(JSON.stringify({ type: variant === "whisper" ? "end_audio" : "input_audio_buffer.commit" }));
				},
				close() {
					if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) ws.close(1000, "done");
				},
			});
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
				o.onError(new Error(p.text ?? p.body?.status ?? JSON.stringify(p)));
				return;
			}
			const fin = finalText(p);
			if (fin) o.onFinal(fin.text, fin.lang);
			if (p.is_final && p.is_end_of_audio_flush) finish();
		});
		ws.on("error", (err) => {
			clearTimeout(timer);
			if (!opened) reject(err);
			else o.onError(err);
		});
		ws.on("close", (code, reason) => {
			clearTimeout(timer);
			if (!opened) reject(new Error(`closed before open: ${code} ${reason.toString()}`));
		});
	});
}

const env = (v: Variant) => ["BASETEN_API_KEY", v === "whisper" ? "BASETEN_WHISPER_MODEL_ID" : "BASETEN_QWEN_MODEL_ID"];

export const whisper: EngineAdapter = {
	id: "whisper",
	label: "Whisper Large V3",
	model: () => `baseten:${process.env.BASETEN_WHISPER_MODEL_ID ?? "?"}`,
	env: env("whisper"),
	supportsLanguage: () => true,
	connect: (o) => connect("whisper", o),
};

export const qwen: EngineAdapter = {
	id: "qwen",
	label: "Qwen3-ASR",
	model: () => `baseten:${process.env.BASETEN_QWEN_MODEL_ID ?? "?"}`,
	env: env("qwen"),
	supportsLanguage: () => true,
	connect: (o) => connect("qwen", o),
};

/** Qwen with the server's speech detection relaxed (QWEN_LOW_VAD); used only for the whispered-speech check. */
export const qwenLowVad: EngineAdapter = { ...qwen, id: "qwen-lowvad", label: "Qwen3-ASR (relaxed server VAD)", connect: (o) => connect("qwen", o, true) };
