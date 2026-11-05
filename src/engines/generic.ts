/**
 * Config-driven adapters, so most engines need a JSON file rather than code.
 * Every *.json in config/engines/ becomes an engine. Two kinds:
 *
 *   "websocket"  streaming APIs: open a socket, send a setup message, stream
 *                audio, send an end message, read final text from messages.
 *   "upload"     batch APIs: audio is collected as it streams, uploaded as one
 *                WAV file when the audio ends, and the text read from the reply.
 *                Latency is then upload plus processing time.
 *
 * Templates. Strings in url, headers, setup, end and form fields may contain:
 *   ${env:NAME}       an environment variable
 *   ${model}          the configured model (overridable with an env var, see modelEnv)
 *   ${language}       the clip's language, mapped through `languages` if given;
 *                     empty when auto-detecting or when the engine has no option for it
 *   ${sample_rate}    the sample rate audio is sent at
 *   ${languages_json} the selected language(s) as a JSON array, e.g. ["en","es"]; empty when
 *                     auto-detecting. Unsupported languages are left out. In a URL it is the
 *                     array's text; as a whole JSON value it is sent as an actual array.
 *   ${primary_language}   the first selected language's code; empty when auto-detecting
 *   ${secondary_language} the second selected language's code (two-language recordings
 *                         with both selected); empty otherwise
 * Empty values are removed: query parameters with no value are dropped from the
 * URL, and keys whose template comes out empty are dropped from JSON messages and form
 * fields (a literal "" in the config is kept).
 *
 * Paths ("channel.alternatives.0.transcript") read nested fields from JSON replies.
 */

import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { WebSocket } from "ws";
import { writeWav16 } from "../audio/wav";
import { ROOT } from "../profile";
import type { ConnectOptions, Connection, EngineAdapter } from "./types";

/** Field path → expected value; a list matches any of its values. */
type Match = Record<string, string | number | boolean | (string | number | boolean)[]>;

type Common = {
	id: string;
	label: string;
	model: string;
	/** Env var that overrides the model, e.g. "DEEPGRAM_MODEL". */
	modelEnv?: string;
	/** Env vars that must be set for the engine to run. */
	env: string[];
	/** ISO 639-1 code → the engine's own code. If present, only these languages are supported. */
	languages?: Record<string, string>;
	/** Sample rate audio is sent at. Must match config/client-profile.json engineAudio if set there. */
	sampleRate?: number;
	/** Language value for mixed-language speech, used when several languages are selected and all are listed. */
	multiLanguage?: { code: string; languages: string[] };
	/** Language value sent when auto-detect is requested. Omit to send no language. */
	autoLanguage?: string;
};

export type WebSocketConfig = Common & {
	kind: "websocket";
	url: string;
	headers?: Record<string, string>;
	/** WebSocket subprotocols to request, e.g. ["live-asr"]. */
	protocols?: string[];
	/** First message after the socket opens, as a JSON template. Omit if the URL carries all settings. */
	setup?: unknown;
	/** When the session is ready: "open" (default) or a match on an incoming message. */
	readyOn?: "open" | Match;
	/** "binary" sends raw PCM frames; an object template sends JSON with ${audio_base64}. */
	audio: "binary" | unknown;
	/** Message sent when the audio ends, as a JSON template, or a list of them sent in order. */
	end?: unknown;
	/** How to recognise final text: messages matching `match`, text at `textPath`. */
	final: { match: Match; textPath: string; languagePath?: string };
	/** How to recognise the end of a clip: a matching message, the socket closing, or (quietMsAfterEnd) no final
	 *  text for that long after the audio ended, for services that commit at pauses and may send nothing at the end. */
	done: { match?: Match; onClose?: boolean; quietMsAfterEnd?: number };
	/** Error messages; one whose message contains an `ignore` text is skipped (e.g. a final commit refused because
	 *  the audio was already committed at a pause). */
	error?: { match: Match; messagePath?: string; ignore?: string[] };
};

export type UploadConfig = Common & {
	kind: "upload";
	url: string;
	method?: "POST" | "PUT";
	headers?: Record<string, string>;
	/** "multipart": a form with the file under `fileField` plus `fields`. "raw": the WAV bytes as the body. */
	body: "multipart" | "raw";
	fileField?: string;
	fields?: Record<string, string>;
	textPath: string;
	languagePath?: string;
};

export type GenericConfig = WebSocketConfig | UploadConfig;

// ---------------------------------------------------------------------------
// Helpers

export function getPath(obj: unknown, path: string): unknown {
	return path.split(".").reduce<unknown>((o, k) => (o == null ? undefined : (o as Record<string, unknown>)[k]), obj);
}

export function matches(msg: unknown, m: Match): boolean {
	return Object.entries(m).every(([p, v]) => (Array.isArray(v) ? v.includes(getPath(msg, p) as string) : getPath(msg, p) === v));
}

type Vars = Record<string, string>;

export function fill(s: string, vars: Vars): string {
	return s.replace(/\$\{(env:)?([A-Za-z0-9_]+)\}/g, (_, env, name) => (env ? process.env[name] ?? "" : vars[name] ?? ""));
}

/** Fill every string in a JSON template and drop keys whose value became "". */
export function fillJson(t: unknown, vars: Vars): unknown {
	// A value that is exactly ${languages_json} is sent as a JSON array, not as the array's text.
	if (t === "${languages_json}") return vars.languages_json ? JSON.parse(vars.languages_json) : "";
	if (typeof t === "string") return fill(t, vars);
	if (Array.isArray(t)) return t.map((x) => fillJson(x, vars));
	if (t && typeof t === "object") {
		const out: Record<string, unknown> = {};
		for (const [k, v] of Object.entries(t)) {
			const f = fillJson(v, vars);
			// Drop a key only when a template value came out empty; a literal "" is sent as is.
			if (f !== "" || v === "") out[k] = f;
		}
		return out;
	}
	return t;
}

/** Fill a URL template and drop query parameters with empty values. */
export function fillUrl(t: string, vars: Vars): string {
	const u = new URL(fill(t, vars));
	for (const [k, v] of [...u.searchParams.entries()]) if (v === "") u.searchParams.delete(k);
	return u.toString();
}

export function varsFor(c: Common, o: ConnectOptions): Vars {
	let lang: string;
	if (o.languageOptions?.length) {
		const m = c.multiLanguage;
		lang = m && o.languageOptions.every((l) => m.languages.includes(l)) ? m.code : c.autoLanguage ?? "";
	} else if (!o.language || o.language === "auto") lang = c.autoLanguage ?? "";
	// A regional tag (ar-SA) is sent as is only when the system lists it; otherwise its bare language is used.
	else lang = c.languages ? c.languages[o.language] ?? c.languages[o.language.split("-")[0]] ?? "" : o.language.split("-")[0];
	const pick = o.languageOptions?.length ? o.languageOptions : o.language && o.language !== "auto" ? [o.language] : [];
	const codes = pick.map((l) => (c.languages ? c.languages[l] ?? c.languages[l.split("-")[0]] : l.split("-")[0])).filter((x): x is string => !!x);
	return {
		model: (c.modelEnv && process.env[c.modelEnv]) || c.model,
		language: lang,
		languages_json: codes.length ? JSON.stringify(codes) : "",
		primary_language: codes[0] ?? "",
		secondary_language: codes[1] ?? "",
		sample_rate: String(c.sampleRate ?? 16000),
	};
}

const fillHeaders = (h: Record<string, string> | undefined, vars: Vars) =>
	Object.fromEntries(Object.entries(h ?? {}).map(([k, v]) => [k, fill(v, vars)]));

// ---------------------------------------------------------------------------
// WebSocket

function connectWebSocket(c: WebSocketConfig, o: ConnectOptions): Promise<Connection> {
	const vars = varsFor(c, o);
	return new Promise((resolve, reject) => {
		const ws = new WebSocket(fillUrl(c.url, vars), c.protocols ?? [], { headers: fillHeaders(c.headers, vars) });
		let ready = false, ended = false, finished = false;
		let quiet: NodeJS.Timeout | undefined;
		const done = () => {
			if (finished) return;
			finished = true;
			if (quiet) clearTimeout(quiet);
			o.onDone();
		};
		const armQuiet = () => {
			if (!c.done.quietMsAfterEnd || !ended || finished) return;
			if (quiet) clearTimeout(quiet);
			quiet = setTimeout(done, c.done.quietMsAfterEnd);
		};
		const timer = setTimeout(() => {
			if (!ready) {
				ws.terminate();
				reject(new Error("connection timed out"));
			}
		}, o.connectTimeoutMs ?? 10_000);
		const conn: Connection = {
			sendAudio(chunk) {
				if (ws.readyState !== WebSocket.OPEN) return;
				if (c.audio === "binary") ws.send(chunk);
				else ws.send(JSON.stringify(fillJson(c.audio, { ...vars, audio_base64: chunk.toString("base64") })));
			},
			endAudio() {
				if (ws.readyState !== WebSocket.OPEN || ended) return;
				ended = true;
				// A list sends each message in turn (e.g. force the end of the current turn, then end the session).
				if (c.end !== undefined) for (const m of Array.isArray(c.end) ? c.end : [c.end]) ws.send(JSON.stringify(fillJson(m, vars)));
				armQuiet();
			},
			close() {
				if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) ws.close(1000, "done");
			},
		};
		const markReady = () => {
			if (ready) return;
			ready = true;
			clearTimeout(timer);
			resolve(conn);
		};

		ws.on("open", () => {
			if (c.setup !== undefined) ws.send(JSON.stringify(fillJson(c.setup, vars)));
			if (!c.readyOn || c.readyOn === "open") markReady();
		});
		ws.on("message", (data: Buffer, isBinary: boolean) => {
			if (isBinary) return;
			let m: unknown;
			try {
				m = JSON.parse(data.toString());
			} catch {
				return;
			}
			if (!ready && c.readyOn && c.readyOn !== "open" && matches(m, c.readyOn)) markReady();
			if (c.error && matches(m, c.error.match)) {
				const msg = String((c.error.messagePath && getPath(m, c.error.messagePath)) ?? JSON.stringify(m));
				if (c.error.ignore?.some((t) => msg.includes(t))) {
					armQuiet();
					return;
				}
				if (!ready) {
					clearTimeout(timer);
					reject(new Error(msg));
				} else o.onError(new Error(msg));
				return;
			}
			if (matches(m, c.final.match)) {
				const text = String(getPath(m, c.final.textPath) ?? "").trim();
				const lang = c.final.languagePath ? (getPath(m, c.final.languagePath) as string | undefined) : undefined;
				if (text) o.onFinal(text, lang);
				armQuiet();
			}
			if (c.done.match && matches(m, c.done.match) && ended) done();
		});
		ws.on("error", (err) => {
			clearTimeout(timer);
			if (!ready) reject(err);
			else o.onError(err);
		});
		ws.on("close", (code, reason) => {
			clearTimeout(timer);
			if (!ready) reject(new Error(`closed before ready: ${code} ${reason.toString()}`));
			else if (c.done.onClose && ended) done();
		});
	});
}

// ---------------------------------------------------------------------------
// Upload

function connectUpload(c: UploadConfig, o: ConnectOptions): Promise<Connection> {
	const vars = varsFor(c, o);
	const rate = c.sampleRate ?? 16000;
	const chunks: Buffer[] = [];
	let closed = false;
	return Promise.resolve({
		sendAudio(chunk) {
			chunks.push(chunk);
		},
		endAudio() {
			const pcm = Buffer.concat(chunks);
			const samples = new Float32Array(pcm.length / 2);
			for (let i = 0; i < samples.length; i++) samples[i] = pcm.readInt16LE(i * 2) / 32767;
			const wav = writeWav16(samples, rate);
			const headers = fillHeaders(c.headers, vars);
			let body: Uint8Array | FormData;
			if (c.body === "raw") {
				body = new Uint8Array(wav);
				headers["Content-Type"] ??= "audio/wav";
			} else {
				const form = new FormData();
				form.append(c.fileField ?? "file", new Blob([new Uint8Array(wav)], { type: "audio/wav" }), "audio.wav");
				for (const [k, v] of Object.entries(c.fields ?? {})) {
					const f = fill(v, vars);
					if (f !== "") form.append(k, f);
				}
				body = form;
			}
			fetch(fillUrl(c.url, vars), { method: c.method ?? "POST", headers, body })
				.then(async (r) => {
					const text = await r.text();
					if (!r.ok) throw new Error(`HTTP ${r.status}: ${text.slice(0, 200)}`);
					const json = JSON.parse(text);
					const out = String(getPath(json, c.textPath) ?? "").trim();
					if (out && !closed) o.onFinal(out, c.languagePath ? (getPath(json, c.languagePath) as string | undefined) : undefined);
				})
				.catch((e: Error) => o.onError(e))
				.finally(() => o.onDone());
		},
		close() {
			closed = true;
		},
	});
}

// ---------------------------------------------------------------------------
// Loading

export function adapterFrom(c: GenericConfig): EngineAdapter {
	return {
		id: c.id,
		label: c.label,
		model: () => (c.modelEnv && process.env[c.modelEnv]) || c.model,
		variant: createHash("sha1").update(JSON.stringify({ ...c, $comment: undefined })).digest("hex").slice(0, 10),
		env: c.env,
		supportsLanguage: (code) => !c.languages || code in c.languages || code.split("-")[0] in c.languages,
		connect: (o) => (c.kind === "websocket" ? connectWebSocket(c, o) : connectUpload(c, o)),
	};
}

export function loadGenericEngines(): EngineAdapter[] {
	const dir = resolve(ROOT, "config", "engines");
	if (!existsSync(dir)) return [];
	return readdirSync(dir)
		.filter((f) => f.endsWith(".json"))
		.sort()
		.map((f) => {
			const c = JSON.parse(readFileSync(resolve(dir, f), "utf-8")) as GenericConfig;
			if (c.kind !== "websocket" && c.kind !== "upload") throw new Error(`config/engines/${f}: kind must be "websocket" or "upload"`);
			return adapterFrom(c);
		});
}
