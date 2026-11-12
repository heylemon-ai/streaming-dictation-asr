/**
 * TEN VAD (github.com/TEN-framework/ten-vad, Apache 2.0), with the same predict()
 * interface as SileroVad so the two can be swapped.
 *
 * TEN VAD ships as a native library with Python bindings, so each recording gets its own
 * Python process (scripts/tenvad_server.py, installed by scripts/setup-tenvad.sh) with a
 * fresh model state. TEN works on 256-sample (16 ms) frames; predict() takes Silero's
 * 512-sample window, runs it as two frames and returns the higher probability, so a window
 * counts as speech when either half does (TEN's default threshold is 0.5, the same as ours).
 */

import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { ROOT } from "../profile";

const PY = resolve(ROOT, ".venv-tenvad", "bin", "python");
const SERVER = resolve(ROOT, "scripts", "tenvad_server.py");
const HOP = 256;

export class TenVad {
	private proc: ChildProcessWithoutNullStreams;
	private buf = "";
	private waiting: ((p: number) => void)[] = [];

	private constructor() {
		this.proc = spawn(PY, [SERVER], { stdio: ["pipe", "pipe", "pipe"] });
		this.proc.stdout.setEncoding("utf8");
		this.proc.stdout.on("data", (d: string) => {
			this.buf += d;
			let i: number;
			while ((i = this.buf.indexOf("\n")) >= 0) {
				const line = this.buf.slice(0, i);
				this.buf = this.buf.slice(i + 1);
				this.waiting.shift()?.(Number(line.split(" ")[0]));
			}
		});
		// A failed process answers every pending window as speech (fail-open, as the Silero gate does).
		const fail = () => { for (const w of this.waiting.splice(0)) w(1); };
		this.proc.on("exit", fail);
		this.proc.on("error", fail);
	}

	static async fresh(): Promise<TenVad> {
		if (!existsSync(PY)) throw new Error("TEN VAD is not installed: run scripts/setup-tenvad.sh");
		return new TenVad();
	}

	private frame(samples: Float32Array): Promise<number> {
		const b = Buffer.alloc(HOP * 2);
		for (let i = 0; i < HOP; i++) b.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(samples[i] * 32767))), i * 2);
		return new Promise((ok) => {
			this.waiting.push(ok);
			this.proc.stdin.write(b);
		});
	}

	/** Speech probability for a 512-sample window: the higher of its two 256-sample frames. */
	async predict(chunk: Float32Array): Promise<number> {
		if (chunk.length !== HOP * 2) return 1.0;
		const [a, b] = await Promise.all([this.frame(chunk.subarray(0, HOP)), this.frame(chunk.subarray(HOP))]);
		return Math.max(a, b);
	}

	close() {
		this.proc.stdin.end();
	}
}
