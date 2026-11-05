import assert from "node:assert/strict";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { test } from "node:test";
import { WebSocketServer } from "ws";
import { PlainStream } from "../src/audio/stream";
import { adapterFrom, fill, fillJson, fillUrl, getPath, matches } from "../src/engines/generic";
import { transcribe } from "../src/engines/harness";

test("templates fill variables and drop empty values", () => {
	process.env.TEST_KEY = "abc";
	assert.equal(fill("Bearer ${env:TEST_KEY} ${model}", { model: "m1" }), "Bearer abc m1");
	assert.deepEqual(fillJson({ a: "${language}", b: "${model}", c: [1, "${model}"] }, { language: "", model: "m" }), { b: "m", c: [1, "m"] });
	assert.equal(fillUrl("wss://x.test/l?model=${model}&language=${language}", { model: "n3", language: "" }), "wss://x.test/l?model=n3");
});

test("paths and matches read nested fields", () => {
	const m = { type: "Results", is_final: true, channel: { alternatives: [{ transcript: "hi" }] } };
	assert.equal(getPath(m, "channel.alternatives.0.transcript"), "hi");
	assert.ok(matches(m, { type: "Results", is_final: true }));
	assert.ok(!matches(m, { type: "Other" }));
});

/** One second of quiet tone at 16 kHz. */
const wav = () => {
	const samples = new Float32Array(16000);
	for (let i = 0; i < samples.length; i++) samples[i] = 0.1 * Math.sin((2 * Math.PI * 440 * i) / 16000);
	return { sampleRate: 16000, samples, durationMs: 1000 };
};
const play = { language: "en", speed: 20, feedSamples: 512, feedIntervalMs: 32, sampleRate: 16000 };

test("websocket adapter streams audio and collects finals until close", async () => {
	const server = new WebSocketServer({ port: 0 });
	let bytes = 0;
	server.on("connection", (ws, req) => {
		assert.match(req.url ?? "", /language=en/);
		ws.on("message", (data, isBinary) => {
			if (isBinary) return void (bytes += (data as Buffer).length);
			const m = JSON.parse(data.toString());
			if (m.type === "CloseStream") {
				ws.send(JSON.stringify({ type: "Results", is_final: false, channel: { alternatives: [{ transcript: "partial" }] } }));
				ws.send(JSON.stringify({ type: "Results", is_final: true, channel: { alternatives: [{ transcript: "hello there" }] } }));
				ws.close();
			}
		});
	});
	const port = (server.address() as AddressInfo).port;
	const engine = adapterFrom({
		id: "mock-ws", label: "Mock", kind: "websocket", model: "m", env: [],
		url: `ws://127.0.0.1:${port}/listen?language=\${language}`, audio: "binary", end: { type: "CloseStream" },
		final: { match: { type: "Results", is_final: true }, textPath: "channel.alternatives.0.transcript" }, done: { onClose: true },
	});
	const r = await transcribe(engine, new PlainStream(512, 1600, 16000), wav(), play);
	server.close();
	assert.equal(r.error, undefined);
	assert.equal(r.text, "hello there");
	assert.ok(bytes >= 32000, `sent ${bytes} bytes`);
});

test("upload adapter posts one WAV and reads the text", async () => {
	let got = { type: "", size: 0, model: "" };
	const server = createServer(async (req, res) => {
		const chunks: Buffer[] = [];
		for await (const c of req) chunks.push(c as Buffer);
		const body = Buffer.concat(chunks);
		got = { type: req.headers["content-type"] ?? "", size: body.length, model: /name="model"\r\n\r\n([^\r]+)/.exec(body.toString("latin1"))?.[1] ?? "" };
		res.setHeader("Content-Type", "application/json");
		res.end(JSON.stringify({ text: "uploaded fine" }));
	});
	await new Promise<void>((r) => server.listen(0, r));
	const port = (server.address() as AddressInfo).port;
	const engine = adapterFrom({
		id: "mock-up", label: "Mock", kind: "upload", model: "m2", env: [],
		url: `http://127.0.0.1:${port}/transcribe`, body: "multipart", fields: { model: "${model}", language: "${language}" }, textPath: "text",
	});
	const r = await transcribe(engine, new PlainStream(512, 1600, 16000), wav(), play);
	server.close();
	assert.equal(r.error, undefined);
	assert.equal(r.text, "uploaded fine");
	assert.match(got.type, /multipart\/form-data/);
	assert.equal(got.model, "m2");
	assert.ok(got.size > 32000);
});

test("language selection: mapped, multilingual, auto and unsupported", async () => {
	const { varsFor } = await import("../src/engines/generic");
	const c = { id: "x", label: "x", model: "m", env: [], languages: { en: "en", ar: "ar" }, multiLanguage: { code: "multi", languages: ["en", "es"] }, autoLanguage: "multi" };
	const noop = { onFinal() {}, onDone() {}, onError() {} };
	assert.equal(varsFor(c, { ...noop, language: "ar" }).language, "ar");
	assert.equal(varsFor(c, { ...noop, language: "auto", languageOptions: ["en", "es"] }).language, "multi");
	assert.equal(varsFor(c, { ...noop, language: "auto", languageOptions: ["en", "ar"] }).language, "multi");
	assert.equal(varsFor(c, { ...noop, language: "auto" }).language, "multi");
	assert.equal(varsFor({ ...c, autoLanguage: undefined }, { ...noop, language: "auto" }).language, "");
	assert.equal(varsFor(c, { ...noop, language: "de" }).language, "");
});
