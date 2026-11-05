/**
 * Generates the `nonspeech` set: clips with no speech, to measure whether an
 * engine returns text when nobody spoke. Deterministic (seeded), so every run
 * and every reader gets identical audio.
 *
 *   npm run nonspeech
 *
 * Writes data/nonspeech/*.wav and transcripts.tsv (empty references).
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { writeWav16 } from "../src/audio/wav";
import { writeTsv } from "../src/manifest";
import { ROOT } from "../src/profile";

const RATE = 16000;
const dir = resolve(ROOT, "data", "nonspeech");
mkdirSync(dir, { recursive: true });

function rng(seed: number) {
	return () => {
		seed = (seed * 1664525 + 1013904223) >>> 0;
		return seed / 4294967296;
	};
}

/** Approximately pink noise (Paul Kellet's filter), scaled to a target level in dBFS RMS. */
function pinkNoise(sec: number, dbfs: number, seed: number): Float32Array {
	const r = rng(seed), out = new Float32Array(sec * RATE);
	let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
	for (let i = 0; i < out.length; i++) {
		const w = r() * 2 - 1;
		b0 = 0.99886 * b0 + w * 0.0555179; b1 = 0.99332 * b1 + w * 0.0750759; b2 = 0.969 * b2 + w * 0.153852;
		b3 = 0.8665 * b3 + w * 0.3104856; b4 = 0.55 * b4 + w * 0.5329522; b5 = -0.7616 * b5 - w * 0.016898;
		out[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + w * 0.5362;
		b6 = w * 0.115926;
	}
	const rms = Math.sqrt(out.reduce((a, s) => a + s * s, 0) / out.length);
	const gain = Math.pow(10, dbfs / 20) / rms;
	for (let i = 0; i < out.length; i++) out[i] *= gain;
	return out;
}

/** Steady hum with harmonics, like a fan or air conditioner. */
function hum(sec: number, dbfs: number, f0: number): Float32Array {
	const out = new Float32Array(sec * RATE);
	for (let i = 0; i < out.length; i++) {
		const t = i / RATE;
		out[i] = Math.sin(2 * Math.PI * f0 * t) + 0.5 * Math.sin(2 * Math.PI * 2 * f0 * t) + 0.25 * Math.sin(2 * Math.PI * 3 * f0 * t);
	}
	const rms = Math.sqrt(out.reduce((a, s) => a + s * s, 0) / out.length);
	const gain = Math.pow(10, dbfs / 20) / rms;
	for (let i = 0; i < out.length; i++) out[i] *= gain;
	return out;
}

const clips: { file: string; audio: Float32Array; note: string }[] = [];
for (const sec of [3, 10, 30]) clips.push({ file: `silence-${sec}s.wav`, audio: new Float32Array(sec * RATE), note: "digital silence" });
for (const [i, db] of [-60, -45, -35].entries()) clips.push({ file: `room-noise-${-db}dbfs.wav`, audio: pinkNoise(10, db, 100 + i), note: "pink noise" });
for (const [i, f] of [50, 60, 120].entries()) clips.push({ file: `hum-${f}hz.wav`, audio: hum(10, -40, f), note: `hum ${f} Hz` });
clips.push({ file: "noise-burst.wav", audio: pinkNoise(6, -30, 999), note: "louder noise" });

for (const c of clips) writeFileSync(resolve(dir, c.file), writeWav16(c.audio, RATE));
writeFileSync(resolve(dir, "transcripts.tsv"), writeTsv(clips.map((c) => ({ file: c.file, reference: "", speaker: "", source_id: c.note })), ["file", "reference", "speaker", "source_id"]));
console.log(`${clips.length} non-speech clips → data/nonspeech/`);
