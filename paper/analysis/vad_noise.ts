/**
 * Does TEN VAD keep whispered speech only because it calls more of everything speech? Runs Silero VAD and TEN VAD
 * over our clips and the external corpora in the client's 32 ms windows and reports the share of windows at or above
 * 0.5 (the drop threshold of the test client), per set. Local only: no API calls.
 *
 *   npx tsx paper/analysis/vad_noise.ts > paper/analysis/vad_noise.json
 *
 * The share is over all windows, including real pauses, so it is not recall or a false-positive rate on its own.
 * Two comparisons isolate background sound: the no-speech clips (every window called speech is a false positive),
 * and VOiCES, where the same sentence from the same far microphone is recorded with no background sound, with
 * babble and with a television, so the extra share under babble or TV is background called speech.
 */
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { readWav } from "../../src/audio/wav";
import { SileroVad } from "../../src/audio/vad";
import { TenVad } from "../../src/audio/tenvad";
import { readTsv } from "../../src/manifest";
import { ROOT } from "../../src/profile";

const WINDOW = 512, THRESHOLD = 0.5;
const SOURCES = [
	{ dir: "data", sets: ["en-dictation", "en-dictation-noise", "en-dictation-whisper", "nonspeech"] },
	{ dir: "data-external/ears", sets: ["ears-regular", "ears-whisper"] },
	{ dir: "data-external/voices", sets: ["voices-clean", "voices-far", "voices-far-babble", "voices-far-tv"] },
];

async function share(kind: "silero" | "ten", samples: Float32Array) {
	const vad = kind === "ten" ? await TenVad.fresh() : await SileroVad.fresh();
	let n = 0, above = 0;
	for (let i = 0; i + WINDOW <= samples.length; i += WINDOW, n++) if ((await vad.predict(samples.subarray(i, i + WINDOW))) >= THRESHOLD) above++;
	if (vad instanceof TenVad) vad.close();
	return { n, above };
}

async function main() {
	const out: Record<string, Record<string, unknown>> = {};
	const nonspeech: Record<string, Record<string, number>> = {};
	const missing: string[] = [];
	for (const src of SOURCES) {
		const dir = resolve(ROOT, src.dir), manifest = resolve(dir, "manifest.tsv");
		if (!existsSync(manifest)) { missing.push(src.dir); continue; }
		const clips = readTsv(manifest).filter((c) => src.sets.includes(c.set));
		const agg: Record<string, Record<string, { n: number; above: number; clips: number }>> = {};
		for (const c of clips) {
			const path = resolve(dir, c.file);
			if (!existsSync(path)) { missing.push(c.file); continue; }
			const wav = readWav(path);
			for (const kind of ["silero", "ten"] as const) {
				const s = await share(kind, wav.samples);
				const a = ((agg[c.set] ??= {})[kind] ??= { n: 0, above: 0, clips: 0 });
				a.n += s.n; a.above += s.above; a.clips++;
				if (c.set === "nonspeech") (nonspeech[c.id.split("/").pop()!] ??= {})[kind] = +((100 * s.above) / s.n).toFixed(1);
			}
		}
		for (const [set, byKind] of Object.entries(agg))
			out[set] = { clips: byKind.silero.clips, ...Object.fromEntries(Object.entries(byKind).map(([k, a]) => [k, +((100 * a.above) / a.n).toFixed(1)])) };
	}
	console.log(JSON.stringify({ threshold: THRESHOLD, shareOfWindowsAtOrAbove: out, nonspeechByClip: nonspeech, missing: missing.slice(0, 20), missingCount: missing.length }, null, 1));
}

main().catch((e) => { console.error(e); process.exit(1); });
