export type ConnectOptions = {
	/** ISO 639-1 code, or "auto" for the engine's own language detection. */
	language?: string;
	/** Several expected languages, for code-switching runs. */
	languageOptions?: string[];
	/** Vocabulary hints, as "Words: a, b, c". */
	prompt?: string;
	connectTimeoutMs?: number;
	onFinal: (text: string, detectedLanguage?: string) => void;
	onDone: () => void;
	onError: (err: Error) => void;
};

export type Connection = {
	sendAudio: (chunk: Buffer) => void;
	endAudio: () => void;
	close: () => void;
};

export type EngineAdapter = {
	id: string;
	label: string;
	/** Model or version string recorded with every result. */
	model: () => string;
	/** Fingerprint of settings that change transcripts (config-file engines). Part of the cache key, so editing the config reruns the engine. */
	variant?: string;
	/** Environment variables it needs; the runner skips the engine if any are missing. */
	env: string[];
	/** Whether the engine has an option for this language. If not, the clip is sent without one and the engine auto-detects. */
	supportsLanguage: (code: string) => boolean;
	connect: (opts: ConnectOptions) => Promise<Connection>;
};

export type TranscribeResult = {
	text: string;
	segments: string[];
	detectedLanguage?: string;
	/** Audio actually sent after client-side shaping, in ms. */
	sentAudioMs: number;
	connectMs: number;
	/** End of audio to final transcript: the wait a person experiences. */
	latencyMs: number;
	/** Start of playback to the first final text, and whether it came before the audio ended (live text). */
	firstFinalMs?: number;
	firstFinalBeforeEnd?: boolean;
	/** Length of the clip played. */
	audioMs?: number;
	totalMs: number;
	error?: string;
};
