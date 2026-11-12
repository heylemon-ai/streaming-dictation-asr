/**
 * Logs every message Gemini 3.5 Transcribe sends during one dictation, in VERBATIM and SMART modes,
 * with times relative to the end of the audio. Used to see whether Smart's text arrives while the
 * person speaks or only after they stop, and in how many pieces.
 *
 *   npx tsx scripts/gemini-trace.ts <wav> [<wav> ...]
 *
 * Audio is sent in real time in 32 ms chunks, as the test client sends it; manual activity start/end.
 * --json prints one line per file and mode: the last interim text and the final text.
 * Prints message texts, so only use it on audio that is not user data.
 */

import { config } from "dotenv";
import { resolve } from "node:path";
import { WebSocket } from "ws";
import { readWav } from "../src/audio/wav";
import { ROOT } from "../src/profile";

config({ path: resolve(ROOT, ".env"), quiet: true });
const key = process.env.GEMINI_API_KEY!;
const model = process.env.GEMINI_ASR_MODEL || "gemini-3.5-transcribe-live";
const JSON_OUT = process.argv.includes("--json");
const url = `wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContent?key=${key}`;

function trace(file: string, mode: "VERBATIM" | "SMART"): Promise<void> {
	const wav = readWav(file);
	const pcm = Buffer.alloc(wav.samples.length * 2);
	wav.samples.forEach((v, i) => pcm.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(v * 32767))), i * 2));
	return new Promise((done) => {
		const ws = new WebSocket(url);
		let endAt = 0, startAt = 0;
		const log: string[] = [];
		let lastInterim = "", final = "";
		const t = () => (endAt ? `+${Date.now() - endAt}ms after end` : `${Date.now() - startAt}ms into audio`);
		ws.on("open", () =>
			ws.send(JSON.stringify({ setup: { model: `models/${model}`, generationConfig: { responseModalities: ["TEXT"] }, realtimeInputConfig: { automaticActivityDetection: { disabled: true } }, inputAudioTranscription: { mode, languageCodes: ["en-US"] } } })),
		);
		ws.on("message", async (data: Buffer) => {
			const p = JSON.parse(data.toString());
			if (p.setupComplete) {
				ws.send(JSON.stringify({ realtimeInput: { activityStart: {} } }));
				startAt = Date.now();
				const chunk = 512 * 2;
				for (let o = 0, i = 0; o < pcm.length; o += chunk, i++) {
					const wait = startAt + i * 32 - Date.now();
					if (wait > 0) await new Promise((r) => setTimeout(r, wait));
					ws.send(JSON.stringify({ realtimeInput: { audio: { data: pcm.subarray(o, o + chunk).toString("base64"), mimeType: "audio/pcm;rate=16000" } } }));
				}
				ws.send(JSON.stringify({ realtimeInput: { activityEnd: {} } }));
				endAt = Date.now();
				setTimeout(() => ws.close(), Number(process.env.TRACE_WAIT_MS || 8000));
				return;
			}
			const sc = p.serverContent;
			const keys = Object.keys(p).join(",") + (sc ? `[${Object.keys(sc).join(",")}]` : "");
			const text = sc?.inputTranscription?.text ?? (sc?.interimInputTranscription ? `(interim) ${JSON.stringify(sc.interimInputTranscription)}` : undefined);
			if (sc?.interimInputTranscription?.text) lastInterim = sc.interimInputTranscription.text;
			if (sc?.inputTranscription?.text) final = sc.inputTranscription.text;
			log.push(`  ${t().padEnd(22)} ${keys}${text != null ? `  ${JSON.stringify(text)}` : ""}`);
			if (sc?.turnComplete && endAt) ws.close();
		});
		ws.on("close", () => {
			if (JSON_OUT) {
				console.log(JSON.stringify({ file: file.split("/").pop(), mode, lastInterim, final }));
				return done();
			}
			console.log(`\n## ${mode}  ${file.split("/").pop()}  (${(wav.durationMs / 1000).toFixed(1)} s)`);
			console.log(log.join("\n") || "  (no messages)");
			done();
		});
		ws.on("error", (e) => console.log(`  error ${e.message}`));
	});
}

(async () => {
	for (const f of process.argv.slice(2).filter((a) => !a.startsWith("--"))) for (const m of ["VERBATIM", "SMART"] as const) await trace(f, m);
})();
