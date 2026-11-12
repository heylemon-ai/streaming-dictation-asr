/**
 * Template for a new engine adapter. Copy this file, rename it, fill in the
 * three marked places, and add the export to ENGINES in src/engines/index.ts.
 *
 * The harness calls connect() once per clip, then sendAudio() with 16-bit PCM
 * chunks in real time (at the sample rate set for this engine in
 * config/client-profile.json, default 16 kHz), then endAudio(). Call
 * onFinal() for each piece of final text and onDone() once the engine has
 * returned everything for the clip.
 *
 * This file is not registered and does not run.
 */

import { WebSocket } from "ws";
import type { ConnectOptions, Connection, EngineAdapter } from "./types";

const MODEL = () => process.env.MY_ASR_MODEL || "my-model-v1";

function connect(o: ConnectOptions): Promise<Connection> {
	const apiKey = process.env.MY_ASR_API_KEY;
	if (!apiKey) return Promise.reject(new Error("MY_ASR_API_KEY is not set"));

	return new Promise((resolve, reject) => {
		// 1. Open the streaming connection.
		const ws = new WebSocket("wss://api.example.com/v1/stream", { headers: { Authorization: `Bearer ${apiKey}` } });
		let ready = false;
		const timer = setTimeout(() => {
			if (!ready) {
				ws.terminate();
				reject(new Error("connection timed out"));
			}
		}, o.connectTimeoutMs ?? 10_000);

		ws.on("open", () => {
			// 2. Send the engine's session setup. Pass the language (o.language is an ISO
			//    639-1 code or "auto") and any vocabulary hints (o.prompt) if supported.
			ws.send(JSON.stringify({ type: "start", model: MODEL(), language: o.language, sample_rate: 16000 }));
			ready = true;
			clearTimeout(timer);
			resolve({
				sendAudio: (chunk) => ws.readyState === WebSocket.OPEN && ws.send(chunk),
				endAudio: () => ws.readyState === WebSocket.OPEN && ws.send(JSON.stringify({ type: "end" })),
				close: () => ws.readyState <= WebSocket.OPEN && ws.close(1000, "done"),
			});
		});

		ws.on("message", (data: Buffer) => {
			// 3. Map the engine's messages to onFinal / onDone / onError.
			let m: { type?: string; text?: string; is_final?: boolean; message?: string };
			try {
				m = JSON.parse(data.toString());
			} catch {
				return;
			}
			if (m.type === "transcript" && m.is_final && m.text) o.onFinal(m.text);
			if (m.type === "done") o.onDone();
			if (m.type === "error") o.onError(new Error(m.message ?? "error"));
		});
		ws.on("error", (err) => (ready ? o.onError(err) : reject(err)));
	});
}

export const myEngine: EngineAdapter = {
	id: "my-engine",
	label: "My Engine",
	model: MODEL,
	env: ["MY_ASR_API_KEY"],
	supportsLanguage: () => true,
	connect,
};
