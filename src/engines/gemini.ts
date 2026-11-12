/**
 * Gemini transcription over the Live API, manual start and end of activity.
 * Two modes: VERBATIM (the default: word for word, fillers kept) and SMART (fillers and
 * false starts removed, spoken self-corrections applied, lists, numbers and dates formatted).
 */

import { WebSocket } from "ws";
import { ISO_TO_BCP47 } from "./languages";

/** Regional Arabic and Spanish tags in the supported-language table of the Live transcription docs (checked 2026-11-05). */
const GEMINI_REGIONAL = ["ar-EG", "es-419", "es-US"];
import type { ConnectOptions, Connection, EngineAdapter } from "./types";

const MODEL = () => process.env.GEMINI_ASR_MODEL || "gemini-3.5-transcribe-live";

type Mode = "VERBATIM" | "SMART";

type ServerMessage = {
	setupComplete?: unknown;
	serverContent?: { inputTranscription?: { text?: string }; turnComplete?: boolean };
};

const endpoint = (key: string) =>
	`wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${key}`;

function setup(o: ConnectOptions, mode: Mode): Record<string, unknown> {
	const t: Record<string, unknown> = { mode };
	// A regional tag is sent as is only if Gemini's transcription docs list it; otherwise its bare language's default.
	const tag = (c: string) => (GEMINI_REGIONAL.includes(c) ? c : ISO_TO_BCP47[c] ?? ISO_TO_BCP47[c.split("-")[0]]);
	const codes = o.languageOptions?.length
		? o.languageOptions.map(tag).filter(Boolean)
		: o.language && o.language !== "auto" && tag(o.language)
			? [tag(o.language)]
			: [];
	if (codes.length) t.languageCodes = codes;
	if (o.prompt) {
		const words = o.prompt.replace(/^Words:\s*/i, "").split(",").map((w) => w.trim()).filter(Boolean);
		if (words.length) t.customVocabulary = words;
	}
	return {
		setup: {
			model: `models/${MODEL()}`,
			generationConfig: { responseModalities: ["TEXT"] },
			realtimeInputConfig: { automaticActivityDetection: { disabled: true } },
			inputAudioTranscription: t,
		},
	};
}

function connect(o: ConnectOptions, mode: Mode): Promise<Connection> {
	const key = process.env.GEMINI_API_KEY;
	if (!key) return Promise.reject(new Error("GEMINI_API_KEY is not set"));
	return new Promise((resolve, reject) => {
		const ws = new WebSocket(endpoint(key));
		let ready = false;
		let ended = false;
		const timer = setTimeout(() => {
			if (!ready) {
				ws.terminate();
				reject(new Error("connection timed out"));
			}
		}, o.connectTimeoutMs ?? 10_000);

		ws.on("open", () => ws.send(JSON.stringify(setup(o, mode))));
		ws.on("message", (data: Buffer) => {
			let p: ServerMessage;
			try {
				p = JSON.parse(data.toString());
			} catch {
				return;
			}
			if (p.setupComplete && !ready) {
				ready = true;
				clearTimeout(timer);
				ws.send(JSON.stringify({ realtimeInput: { activityStart: {} } }));
				resolve({
					sendAudio(chunk) {
						if (ws.readyState !== WebSocket.OPEN) return;
						ws.send(JSON.stringify({ realtimeInput: { audio: { data: chunk.toString("base64"), mimeType: "audio/pcm;rate=16000" } } }));
					},
					endAudio() {
						if (ws.readyState !== WebSocket.OPEN || ended) return;
						ended = true;
						ws.send(JSON.stringify({ realtimeInput: { activityEnd: {} } }));
					},
					close() {
						if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) ws.close(1000, "done");
					},
				});
				return;
			}
			const sc = p.serverContent;
			if (!sc) return;
			const text = sc.inputTranscription?.text?.trim();
			if (text) {
				o.onFinal(text);
				if (ended) o.onDone();
			}
			if (sc.turnComplete && ended) o.onDone();
		});
		ws.on("error", (err) => {
			clearTimeout(timer);
			if (!ready) reject(err);
			else o.onError(err);
		});
		ws.on("close", (code, reason) => {
			clearTimeout(timer);
			if (!ready) reject(new Error(`closed before setup: ${code} ${reason.toString()}`));
			else if (ended) o.onDone();
		});
	});
}

const make = (id: string, label: string, mode: Mode): EngineAdapter => ({
	id,
	label,
	model: MODEL,
	env: ["GEMINI_API_KEY"],
	supportsLanguage: (c) => c in ISO_TO_BCP47 || c.split("-")[0] in ISO_TO_BCP47,
	connect: (o) => connect(o, mode),
});

export const gemini = make("gemini", "Gemini 3.5 Transcribe", "VERBATIM");
export const geminiSmart = make("gemini-smart", "Gemini 3.5 Transcribe (Smart)", "SMART");
