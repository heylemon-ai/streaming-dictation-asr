/**
 * Imports test sets from an existing folder laid out as one subfolder per set
 * plus a manifest.csv with columns id, set, file, reference (and optionally
 * gender, dialect, source_id). Each set's own transcripts.tsv is read for a
 * speaker column (speaker_id or speaker) where one exists.
 *
 *   npm run import -- --from /path/to/testsets/asr
 *
 * Copies audio into data/<set>/ for every set listed in config/sets.json and
 * writes each set's transcripts.tsv. Sets not listed in config/sets.json are skipped.
 */

import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { DATA_DIR, readSets, readTsv, writeTsv } from "../src/manifest";

const i = process.argv.indexOf("--from");
const from = i >= 0 ? process.argv[i + 1] : undefined;
if (!from || !existsSync(resolve(from, "manifest.csv"))) {
	console.error("Usage: npm run import -- --from <folder containing manifest.csv>");
	process.exit(1);
}

function parseCsv(text: string): string[][] {
	const rows: string[][] = [];
	let row: string[] = [], field = "", quoted = false;
	for (let k = 0; k < text.length; k++) {
		const c = text[k];
		if (quoted) {
			if (c === '"' && text[k + 1] === '"') { field += '"'; k++; }
			else if (c === '"') quoted = false;
			else field += c;
		} else if (c === '"') quoted = true;
		else if (c === ",") { row.push(field); field = ""; }
		else if (c === "\n" || c === "\r") {
			if (c === "\r" && text[k + 1] === "\n") k++;
			row.push(field); field = "";
			if (row.some((f) => f !== "")) rows.push(row);
			row = [];
		} else field += c;
	}
	if (field || row.length) { row.push(field); rows.push(row); }
	return rows;
}

const csv = parseCsv(readFileSync(resolve(from, "manifest.csv"), "utf-8"));
const rows = csv.slice(1).map((r) => Object.fromEntries(csv[0].map((h, k) => [h, r[k] ?? ""])));

for (const s of readSets()) {
	const mine = rows.filter((r) => r.set === s.id);
	if (!mine.length) continue;
	const speakers = new Map<string, string>();
	const srcTsv = resolve(from, s.id, "transcripts.tsv");
	if (existsSync(srcTsv)) for (const t of readTsv(srcTsv)) speakers.set(basename(t.file), t.speaker_id || t.speaker || "");
	const dest = resolve(DATA_DIR, s.id);
	mkdirSync(dest, { recursive: true });
	const out = mine.map((r) => {
		const f = basename(r.file);
		copyFileSync(resolve(from, r.file), resolve(dest, f));
		return { file: f, reference: r.reference, speaker: speakers.get(f) ?? "", gender: r.gender ?? "", dialect: r.dialect ?? "", source_id: r.source_id ?? "" };
	});
	writeFileSync(resolve(dest, "transcripts.tsv"), writeTsv(out, ["file", "reference", "speaker", "gender", "dialect", "source_id"]));
	const labelled = out.filter((o) => o.speaker).length;
	console.log(`  ${s.id.padEnd(22)} ${String(out.length).padStart(4)} clips → data/${s.id}  (speaker labels: ${labelled}/${out.length})`);
}
