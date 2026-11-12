/**
 * How much of each recording does each VAD call speech? Runs Silero VAD and TEN VAD over every
 * English clip (quiet, fan noise, whispered) and the no-speech clips, in the 32 ms windows the
 * client uses, and reports the share of windows at or above each threshold. Local only: no API calls.
 *
 *   npx tsx paper/analysis/vadshare.ts > paper/analysis/vadshare.json
 *
 * The share is over all windows of the clip, including real pauses, so it is not a recall figure;
 * the comparison that matters is between the two VADs on the same audio.
 */
import { resolve } from "node:path";
import { readWav } from "../../src/audio/wav";
import { SileroVad } from "../../src/audio/vad";
import { TenVad } from "../../src/audio/tenvad";
import { DATA_DIR, readManifest } from "../../src/manifest";

const WINDOW = 512;
const THRESHOLDS = [0.2, 0.3, 0.4, 0.5];
const SETS = ["en-dictation", "en-dictation-noise", "en-dictation-whisper", "nonspeech"];

async function probs(kind: "silero" | "ten", samples: Float32Array): Promise<number[]> {
	const vad = kind === "ten" ? await TenVad.fresh() : await SileroVad.fresh();
	const out: number[] = [];
	for (let i = 0; i + WINDOW <= samples.length; i += WINDOW) out.push(await vad.predict(samples.subarray(i, i + WINDOW)));
	if (vad instanceof TenVad) vad.close();
	return out;
}

async function main() {
	const clips = readManifest().filter((c) => SETS.includes(c.set));
	const agg: Record<string, Record<string, { windows: number; above: number[] }>> = {};
	for (const c of clips) {
		const wav = readWav(resolve(DATA_DIR, c.file));
		for (const kind of ["silero", "ten"] as const) {
			const p = await probs(kind, wav.samples);
			const a = ((agg[c.set] ??= {})[kind] ??= { windows: 0, above: THRESHOLDS.map(() => 0) });
			a.windows += p.length;
			THRESHOLDS.forEach((t, i) => (a.above[i] += p.filter((x) => x >= t).length));
		}
	}
	const out: Record<string, Record<string, Record<string, number>>> = {};
	for (const [set, byKind] of Object.entries(agg))
		for (const [kind, a] of Object.entries(byKind))
			(out[set] ??= {})[kind] = Object.fromEntries(THRESHOLDS.map((t, i) => [String(t), +((100 * a.above[i]) / a.windows).toFixed(1)]));
	console.log(JSON.stringify({ thresholds: THRESHOLDS, shareOfWindowsAtOrAbove: out }, null, 1));
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
