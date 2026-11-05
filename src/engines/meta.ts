/** Meta Muse Voice Transcribe: push-to-talk mode, cumulative partials; the final event carries the whole transcript. */

import { WebSocket } from "ws";
import { ISO_TO_META_LANGUAGE } from "./languages";
import type { ConnectOptions, Connection, EngineAdapter } from "./types";

const MODEL = () => process.env.META_ASR_MODEL || "muse-voice-transcribe-1.0";

type MetaEvent = { type?: string; sessionId?: string; transcript?: string; final?: boolean; message?: string };

function handshake(apiKey: string, o: ConnectOptions): Record<string, unknown> {
	const h: Record<string, unknown> = {
		authorization: { accessToken: `Bearer ${apiKey}` },
		audioEncoding: "PCM_24KHZ",
		model: MODEL(),
		mode: "PUSH_TO_TALK",
		partialMode: "CUMULATIVE",
		emitAudioProgress: false,
	};
	const langs = o.languageOptions?.length ? o.languageOptions : o.language && o.language !== "auto" ? [o.language] : [];
	const bias = langs.map((c) => ISO_TO_META_LANGUAGE[c]).filter(Boolean);
	if (bias.length) h.languageBias = bias;
	if (o.prompt) {
		const words = o.prompt.replace(/^Words:\s*/i, "").split(",").map((w) => w.trim()).filter(Boolean);
		if (words.length) h.keywords = words;
	}
	return h;
}

function connect(o: ConnectOptions): Promise<Connection> {
	const apiKey = process.env.META_MODEL_API_KEY;
	if (!apiKey) return Promise.reject(new Error("META_MODEL_API_KEY is not set"));
	return new Promise((resolve, reject) => {
		const ws = new WebSocket("wss://api.meta.ai/v1/asr/realtime");
		let ready = false;
		const timer = setTimeout(() => {
			if (!ready) {
				ws.terminate();
				reject(new Error("connection timed out"));
			}
		}, o.connectTimeoutMs ?? 10_000);

		ws.on("open", () => ws.send(JSON.stringify(handshake(apiKey, o))));
		ws.on("message", (data: Buffer) => {
			let p: MetaEvent;
			try {
				p = JSON.parse(data.toString());
			} catch {
				return;
			}
			if (!ready && !p.type && p.sessionId) {
				ready = true;
				clearTimeout(timer);
				resolve({
					sendAudio(chunk) {
						if (ws.readyState === WebSocket.OPEN) ws.send(chunk);
					},
					endAudio() {
						if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ type: "endStream" }));
					},
					close() {
						if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) ws.close(1000, "done");
					},
				});
				return;
			}
			if (p.type === "error") {
				if (!ready) {
					clearTimeout(timer);
					ws.close();
					reject(new Error(`handshake error: ${p.message ?? "unknown"}`));
				} else o.onError(new Error(p.message ?? "error"));
				return;
			}
			if (p.type === "transcript" && p.final) {
				const text = (p.transcript ?? "").trim();
				if (text) o.onFinal(text);
				o.onDone();
			}
		});
		ws.on("error", (err) => {
			clearTimeout(timer);
			if (!ready) reject(err);
			else o.onError(err);
		});
		ws.on("close", (code, reason) => {
			clearTimeout(timer);
			if (!ready) reject(new Error(`closed before handshake: ${code} ${reason.toString()}`));
		});
	});
}

export const meta: EngineAdapter = { id: "meta", label: "Meta Muse", model: MODEL, env: ["META_MODEL_API_KEY"], supportsLanguage: (c) => c in ISO_TO_META_LANGUAGE, connect };
