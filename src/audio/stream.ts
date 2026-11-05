/**
 * Client-side audio shaping: what happens to audio between the microphone and
 * the engine. A Shaper takes 16 kHz float batches and returns the byte chunks a
 * client would send right now.
 */

import { floatToInt16, int16Bytes } from "./wav";

export type Shaper = {
	feed: (batch: Float32Array) => Buffer[] | Promise<Buffer[]>;
	/** True when too little audio was sent for a client to submit the recording at all. */
	tooShort: () => boolean;
	flush: () => Buffer[];
	totalStreamedSamples: number;
};

/** Linear-interpolation upsampling from 16 kHz to 24 kHz. */
export function upsample16kTo24k(input: Float32Array): Float32Array {
	const inputCount = input.length;
	const outputCount = Math.floor((inputCount * 3) / 2);
	const output = new Float32Array(Math.max(0, outputCount));
	if (outputCount <= 0) return output;
	const ratio = Math.fround(inputCount / outputCount);
	for (let i = 0; i < outputCount; i++) {
		const srcPos = Math.fround(i * ratio);
		const srcIdx = Math.trunc(srcPos);
		const frac = Math.fround(srcPos - srcIdx);
		if (srcIdx + 1 < inputCount) output[i] = Math.fround(input[srcIdx] * (1 - frac) + input[srcIdx + 1] * frac);
		else if (srcIdx < inputCount) output[i] = input[srcIdx];
	}
	return output;
}

/** No gate: every sample is sent as Int16 in fixed-size chunks; the last chunk is zero-padded. */
export class PlainStream implements Shaper {
	private pcm: number[] = [];
	totalStreamedSamples = 0;

	constructor(
		private chunkSamples: number,
		private minStreamSamples: number,
		private outRate: number,
	) {}

	feed(batch: Float32Array): Buffer[] {
		const s = this.outRate === 24000 ? upsample16kTo24k(batch) : batch;
		for (let i = 0; i < s.length; i++) this.pcm.push(floatToInt16(s[i]));
		const out: Buffer[] = [];
		while (this.pcm.length >= this.chunkSamples) {
			const chunk = this.pcm.splice(0, this.chunkSamples);
			this.totalStreamedSamples += chunk.length;
			out.push(int16Bytes(chunk));
		}
		return out;
	}

	tooShort(): boolean {
		return this.totalStreamedSamples + this.pcm.length < this.minStreamSamples;
	}

	flush(): Buffer[] {
		if (!this.pcm.length) return [];
		const padded = this.pcm.splice(0);
		while (padded.length < this.chunkSamples) padded.push(0);
		this.totalStreamedSamples += padded.length;
		return [int16Bytes(padded)];
	}
}
