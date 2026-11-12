/** Mono WAV reading. 16-bit PCM is divided by 32767; 32-bit float is read as-is. */

import { readFileSync } from "node:fs";

export type Wav = { sampleRate: number; samples: Float32Array; durationMs: number };

export function readWav(path: string): Wav {
	const buf = readFileSync(path);
	if (buf.toString("ascii", 0, 4) !== "RIFF" || buf.toString("ascii", 8, 12) !== "WAVE") {
		throw new Error(`${path}: not a RIFF/WAVE file`);
	}
	let format = 1, channels = 1, sampleRate = 16000, bits = 16;
	let dataStart = -1, dataLen = 0;
	// Walk the chunks: some datasets add a `fact` or `LIST` chunk before `data`.
	for (let off = 12; off + 8 <= buf.length; ) {
		const id = buf.toString("ascii", off, off + 4);
		const size = buf.readUInt32LE(off + 4);
		if (id === "fmt ") {
			format = buf.readUInt16LE(off + 8);
			channels = buf.readUInt16LE(off + 10);
			sampleRate = buf.readUInt32LE(off + 12);
			bits = buf.readUInt16LE(off + 22);
			if (format === 0xfffe) format = buf.readUInt16LE(off + 32); // WAVE_FORMAT_EXTENSIBLE
		} else if (id === "data") {
			dataStart = off + 8;
			dataLen = Math.min(size, buf.length - dataStart);
			break;
		}
		off += 8 + size + (size % 2);
	}
	if (dataStart < 0) throw new Error(`${path}: no data chunk`);
	if (channels !== 1) throw new Error(`${path}: ${channels} channels; expected mono`);

	let samples: Float32Array;
	if (format === 3 && bits === 32) {
		samples = new Float32Array(dataLen / 4);
		for (let i = 0; i < samples.length; i++) samples[i] = buf.readFloatLE(dataStart + i * 4);
	} else if (format === 1 && bits === 16) {
		samples = new Float32Array(dataLen / 2);
		for (let i = 0; i < samples.length; i++) samples[i] = buf.readInt16LE(dataStart + i * 2) / 32767.0;
	} else {
		throw new Error(`${path}: format ${format}/${bits}-bit not supported`);
	}
	return { sampleRate, samples, durationMs: (samples.length / sampleRate) * 1000 };
}

/** 16-bit PCM mono WAV bytes, for generated clips. */
export function writeWav16(samples: Float32Array, sampleRate = 16000): Buffer {
	const data = Buffer.alloc(samples.length * 2);
	samples.forEach((s, i) => data.writeInt16LE(floatToInt16(s), i * 2));
	const h = Buffer.alloc(44);
	h.write("RIFF", 0);
	h.writeUInt32LE(36 + data.length, 4);
	h.write("WAVE", 8);
	h.write("fmt ", 12);
	h.writeUInt32LE(16, 16);
	h.writeUInt16LE(1, 20);
	h.writeUInt16LE(1, 22);
	h.writeUInt32LE(sampleRate, 24);
	h.writeUInt32LE(sampleRate * 2, 28);
	h.writeUInt16LE(2, 32);
	h.writeUInt16LE(16, 34);
	h.write("data", 36);
	h.writeUInt32LE(data.length, 40);
	return Buffer.concat([h, data]);
}

/** Float in [-1, 1] → Int16, truncating toward zero. */
export function floatToInt16(s: number): number {
	const c = Math.max(-1, Math.min(1, s));
	return Math.max(-32768, Math.min(32767, Math.trunc(c * 32767.0)));
}

export function int16Bytes(samples: number[]): Buffer {
	const b = Buffer.alloc(samples.length * 2);
	samples.forEach((s, i) => b.writeInt16LE(s, i * 2));
	return b;
}
