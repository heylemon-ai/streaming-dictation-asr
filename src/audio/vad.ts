/**
 * Voice-activity gate in front of an engine, using the open Silero VAD model
 * (models/silero_vad.onnx, fetched by scripts/fetch-silero.sh).
 *
 * Many live clients only send audio while someone is speaking. That saves cost
 * and bandwidth, but it can also drop very quiet speech before any engine hears
 * it. Running the gate here makes that failure visible in the results.
 *
 * Behaviour, with every number taken from the client profile:
 *  - Speech windows are sent as they arrive.
 *  - A few windows from just before speech starts are kept as lead-in.
 *  - A pause is sent only if speech resumes, and only up to maxPauseSentMs.
 *  - After silenceDetectionMs of silence the gate closes.
 *  - Optionally, once boundaryFlushAfterMs has streamed, the closing pause is
 *    sent so an engine with its own end-of-speech detection sees a boundary.
 *  - Silence still pending at the end of the recording is never sent.
 */

import { resolve } from "node:path";
import * as ort from "onnxruntime-node";
import type { VadGateProfile } from "../profile";
import { ROOT } from "../profile";
import type { Shaper } from "./stream";
import { floatToInt16, int16Bytes } from "./wav";

const WINDOW = 512; // 32 ms at 16 kHz, the size Silero expects
const CONTEXT = 64;
const MS_PER_WINDOW = WINDOW / 16;

export class SileroVad {
	private state = new Float32Array(2 * 1 * 128);
	private context = new Float32Array(CONTEXT);
	private static session: Promise<ort.InferenceSession> | null = null;

	private constructor(private session: ort.InferenceSession) {}

	/** Fresh recurrent state for each recording, over one shared model session. */
	static async fresh(): Promise<SileroVad> {
		SileroVad.session ??= ort.InferenceSession.create(resolve(ROOT, "models", "silero_vad.onnx"));
		return new SileroVad(await SileroVad.session);
	}

	async predict(chunk: Float32Array): Promise<number> {
		if (chunk.length !== WINDOW) return 1.0;
		const input = new Float32Array(CONTEXT + WINDOW);
		input.set(this.context, 0);
		input.set(chunk, CONTEXT);
		const out = await this.session.run({
			input: new ort.Tensor("float32", input, [1, CONTEXT + WINDOW]),
			state: new ort.Tensor("float32", this.state, [2, 1, 128]),
			sr: new ort.Tensor("int64", BigInt64Array.from([16000n]), [1]),
		});
		this.state = new Float32Array(out.stateN.data as Float32Array);
		this.context = input.slice(input.length - CONTEXT);
		return (out.output.data as Float32Array)[0];
	}
}

export class VadGate implements Shaper {
	private floats: number[] = [];
	private pcm: number[] = [];
	private leadIn: Float32Array[] = [];
	private pendingSilence: Float32Array[] = [];
	private inSpeech = false;
	private silenceWindows = 0;
	private samplesAtLastFlush = 0;
	totalStreamedSamples = 0;

	constructor(
		private vad: SileroVad,
		private p: VadGateProfile,
		private chunkSamples: number,
		private minStreamSamples: number,
	) {}

	private append(s: ArrayLike<number>) {
		for (let i = 0; i < s.length; i++) this.pcm.push(floatToInt16(s[i]));
	}

	private ready(): Buffer[] {
		const out: Buffer[] = [];
		while (this.pcm.length >= this.chunkSamples) {
			const chunk = this.pcm.splice(0, this.chunkSamples);
			this.totalStreamedSamples += chunk.length;
			out.push(int16Bytes(chunk));
		}
		return out;
	}

	async feed(batch: Float32Array): Promise<Buffer[]> {
		for (const s of batch) this.floats.push(s);
		const maxPause = Math.trunc(this.p.maxPauseSentMs / MS_PER_WINDOW);
		const flushAfter = this.p.boundaryFlushAfterMs ? (this.p.boundaryFlushAfterMs / 1000) * 16000 : null;
		let flushed = false;
		while (this.floats.length >= WINDOW) {
			const w = Float32Array.from(this.floats.splice(0, WINDOW));
			const prob = await this.vad.predict(w);
			if (prob >= this.p.threshold) {
				if (!this.inSpeech) for (const c of this.leadIn) this.append(c);
				this.leadIn = [];
				this.inSpeech = true;
				for (const c of this.pendingSilence.slice(-maxPause)) this.append(c);
				this.pendingSilence = [];
				this.silenceWindows = 0;
				this.append(w);
			} else if (!this.inSpeech) {
				this.leadIn.push(w);
				if (this.leadIn.length > this.p.leadInWindows) this.leadIn.shift();
			} else {
				this.silenceWindows++;
				this.pendingSilence.push(w);
				if (this.silenceWindows * MS_PER_WINDOW >= this.p.silenceDetectionMs) {
					if (flushAfter !== null && this.totalStreamedSamples - this.samplesAtLastFlush >= flushAfter) {
						for (const c of this.pendingSilence.slice(-maxPause)) this.append(c);
						flushed = true;
					}
					this.pendingSilence = [];
					this.inSpeech = false;
					this.leadIn = [];
					this.silenceWindows = 0;
				}
			}
		}
		const out = this.ready();
		if (flushed) this.samplesAtLastFlush = this.totalStreamedSamples;
		return out;
	}

	tooShort(): boolean {
		return this.totalStreamedSamples + this.pcm.length + this.floats.length < this.minStreamSamples;
	}

	flush(): Buffer[] {
		if (this.floats.length) {
			if (this.inSpeech) this.append(this.floats);
			this.floats = [];
		}
		const out = this.ready();
		if (this.pcm.length) {
			const padded = this.pcm.splice(0);
			while (padded.length < this.chunkSamples) padded.push(0);
			this.totalStreamedSamples += padded.length;
			out.push(int16Bytes(padded));
		}
		return out;
	}
}
