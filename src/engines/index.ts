import { PlainStream, type Shaper } from "../audio/stream";
import { SileroVad, VadGate } from "../audio/vad";
import type { ClientProfile } from "../profile";
import { qwen, qwenLowVad, whisper } from "./baseten";
import { gemini, geminiSmart } from "./gemini";
import { loadGenericEngines } from "./generic";
import { meta } from "./meta";
import { openaiWhisperSplit } from "./openai-whisper-split";
import { whisperSelfHosted, whisperSelfHostedSweep, whisperSelfHostedTen, whisperSelfHostedTenVad, whisperSelfHostedVad } from "./whisper-self-hosted";
import type { EngineAdapter } from "./types";

const BUILT_IN: EngineAdapter[] = [whisper, qwen, qwenLowVad, meta, gemini, geminiSmart, openaiWhisperSplit, whisperSelfHosted, whisperSelfHostedVad, whisperSelfHostedTen, whisperSelfHostedTenVad, ...whisperSelfHostedSweep];

/** Built-in adapters plus every config/engines/*.json. Ids must be unique. */
export const ENGINES: EngineAdapter[] = (() => {
	const all = [...BUILT_IN, ...loadGenericEngines()];
	const seen = new Set<string>();
	for (const e of all) {
		if (seen.has(e.id)) throw new Error(`Duplicate engine id: ${e.id}`);
		seen.add(e.id);
	}
	return all;
})();

/** A fresh shaper per recording: the VAD's recurrent state must not carry over between clips. */
export async function shaperFor(engineId: string, profile: ClientProfile, gate: boolean): Promise<{ shaper: Shaper; sampleRate: number }> {
	const audio = profile.engineAudio[engineId] ?? { sampleRate: 16000, chunkSamples: 512 };
	const minSamples = (profile.minStreamMs / 1000) * audio.sampleRate;
	if (gate && profile.vadGate.enabledFor.includes(engineId)) {
		if (audio.sampleRate !== 16000) throw new Error(`${engineId}: the VAD gate supports 16 kHz output only`);
		return { shaper: new VadGate(await SileroVad.fresh(), profile.vadGate, audio.chunkSamples, minSamples), sampleRate: 16000 };
	}
	return { shaper: new PlainStream(audio.chunkSamples, minSamples, audio.sampleRate), sampleRate: audio.sampleRate };
}
