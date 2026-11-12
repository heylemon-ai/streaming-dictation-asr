/**
 * Builds data/manifest.csv from config/sets.json and each set's transcripts.tsv. With ASR_DATA=<dir>, builds
 * <dir>/manifest.tsv from <dir>/sets.json instead (third-party sets kept apart from our own audio).
 *
 *   npm run manifest
 *
 * A set lives in data/<id>/ and holds 16 kHz mono WAV files plus a
 * transcripts.tsv with at least `file` and `reference` columns. Optional
 * columns: speaker, gender, dialect, source_id. An empty reference marks a
 * non-speech clip, scored on whether the engine produced any text at all.
 */

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { readWav } from "./audio/wav";
import { ROOT } from "./profile";

// ASR_DATA selects another data root (e.g. data-external/ears) that has its own sets.json, set folders and
// manifest, so third-party audio is never mixed into data/ and can be left out of any release of our own data.
export const DATA_DIR = resolve(ROOT, process.env.ASR_DATA || "data");

export type SetDef = { id: string; language: string; condition: string; source: string };

export type Clip = {
	id: string;
	set: string;
	language: string;
	condition: string;
	file: string;
	reference: string;
	speaker: string;
	gender: string;
	dialect: string;
	source_id: string;
	duration_sec: string;
};

const COLUMNS: (keyof Clip)[] = ["id", "set", "language", "condition", "file", "reference", "speaker", "gender", "dialect", "source_id", "duration_sec"];

export function readSets(): SetDef[] {
	const own = resolve(DATA_DIR, "sets.json");
	const path = existsSync(own) ? own : resolve(ROOT, "config", "sets.json");
	return (JSON.parse(readFileSync(path, "utf-8")) as { sets: SetDef[] }).sets;
}

/** Tab-separated, header row first. Tabs and newlines are not allowed inside fields. */
export function readTsv(path: string): Record<string, string>[] {
	const lines = readFileSync(path, "utf-8").split(/\r?\n/).filter((l) => l.length);
	const head = lines[0].split("\t");
	return lines.slice(1).map((l) => {
		const cells = l.split("\t");
		return Object.fromEntries(head.map((h, i) => [h, cells[i] ?? ""]));
	});
}

export function writeTsv(rows: Record<string, string>[], columns: string[]): string {
	const clean = (v: string) => (v ?? "").replace(/[\t\r\n]+/g, " ");
	return [columns.join("\t"), ...rows.map((r) => columns.map((c) => clean(r[c])).join("\t"))].join("\n") + "\n";
}

export function readManifest(): Clip[] {
	const path = resolve(DATA_DIR, "manifest.tsv");
	if (!existsSync(path)) throw new Error("No manifest. Run `npm run manifest` first.");
	return readTsv(path) as Clip[];
}

function build(): Clip[] {
	const out: Clip[] = [];
	for (const s of readSets()) {
		const dir = resolve(DATA_DIR, s.id);
		const tsv = resolve(dir, "transcripts.tsv");
		if (!existsSync(tsv)) {
			console.warn(`  skipped ${s.id}: no data/${s.id}/transcripts.tsv`);
			continue;
		}
		for (const r of readTsv(tsv)) {
			const file = `${s.id}/${r.file}`;
			const wav = readWav(resolve(DATA_DIR, file));
			if (wav.sampleRate !== 16000) throw new Error(`${file}: ${wav.sampleRate} Hz; expected 16000`);
			out.push({
				id: `${s.id}/${r.file.replace(/\.wav$/i, "")}`,
				set: s.id,
				language: s.language,
				condition: s.condition,
				file,
				reference: r.reference ?? "",
				speaker: r.speaker ?? "",
				gender: r.gender ?? "",
				dialect: r.dialect ?? "",
				source_id: r.source_id ?? "",
				duration_sec: (wav.durationMs / 1000).toFixed(2),
			});
		}
	}
	return out;
}

if (require.main === module) {
	const clips = build();
	writeFileSync(resolve(DATA_DIR, "manifest.tsv"), writeTsv(clips as unknown as Record<string, string>[], COLUMNS));
	const by: Record<string, { n: number; sec: number; speakers: Set<string> }> = {};
	for (const c of clips) {
		const b = (by[c.set] ??= { n: 0, sec: 0, speakers: new Set() });
		b.n++;
		b.sec += Number(c.duration_sec);
		if (c.speaker) b.speakers.add(c.speaker);
	}
	console.log(`${clips.length} clips → ${resolve(DATA_DIR, "manifest.tsv")}`);
	for (const [k, v] of Object.entries(by)) {
		console.log(`  ${k.padEnd(22)} ${String(v.n).padStart(4)} clips  ${(v.sec / 60).toFixed(1).padStart(6)} min  ${v.speakers.size || "?"} speakers`);
	}
}
