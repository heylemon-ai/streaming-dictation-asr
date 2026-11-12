/** How many engines add the same extra words to each clean English clip: shared additions point to the reader going off-script, not to the engine. */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { tokens } from "../../src/score";
const ROOT = resolve(import.meta.dirname, "../..");
const read = (p: string) => { const [h, ...l] = readFileSync(resolve(ROOT, p), "utf-8").split("\n").filter(Boolean); const c = h.split("\t"); return l.map((x) => Object.fromEntries(x.split("\t").map((v, i) => [c[i], v]))); };
const rows = read("cache/clips/2026-10-21-main.tsv").filter((r) => r.set === "en-dictation" && r.run === "0");
function insWords(ref: string[], hyp: string[]): string[] {
	const m = ref.length, n = hyp.length, d = Array.from({ length: m + 1 }, () => new Uint32Array(n + 1));
	for (let i = 0; i <= m; i++) d[i][0] = i; for (let j = 0; j <= n; j++) d[0][j] = j;
	for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i-1][j-1] + (ref[i-1] === hyp[j-1] ? 0 : 1), d[i-1][j] + 1, d[i][j-1] + 1);
	const ins: string[] = []; let i = m, j = n;
	while (i > 0 || j > 0) { if (i > 0 && j > 0 && d[i][j] === d[i-1][j-1] + (ref[i-1] === hyp[j-1] ? 0 : 1)) { i--; j--; } else if (i > 0 && d[i][j] === d[i-1][j] + 1) i--; else { ins.push(hyp[j-1]); j--; } }
	return ins;
}
const byClip: Record<string, Record<string, Set<string>>> = {};
for (const r of rows) (byClip[r.clip] ??= {})[r.engine] = new Set(insWords(tokens(r.reference, "en", "wer"), tokens(r.transcript, "en", "wer")));
// Unique and shared extra words are counted over the eleven distinct systems. Gemini Smart and ElevenLabs
// no-verbatim are settings of Gemini and ElevenLabs, so each is compared against the other ten
// systems in place of its parent, not alongside it.
const PARENT: Record<string, string> = { "gemini-smart": "gemini", "elevenlabs-scribe-clean": "elevenlabs-scribe" };
const NINE = (e: string) => !(e in PARENT);
let shared = 0, total = 0; const solo: Record<string, number> = {}, all: Record<string, number> = {};
for (const m of Object.values(byClip)) for (const [e, s] of Object.entries(m)) for (const w of s) {
	if (!NINE(e)) continue;
	const k = Object.entries(m).filter(([o, x]) => NINE(o) && x.has(w)).length; total++; all[e] = (all[e] ?? 0) + 1;
	if (k >= 4) shared++; else if (k === 1) solo[e] = (solo[e] ?? 0) + 1;
}
for (const [v, parent] of Object.entries(PARENT))
	for (const m of Object.values(byClip)) for (const w of m[v] ?? []) {
		all[v] = (all[v] ?? 0) + 1;
		if (!Object.entries(m).some(([o, x]) => NINE(o) && o !== parent && x.has(w))) solo[v] = (solo[v] ?? 0) + 1;
	}
const fill = ["um", "uh", "so", "like", "okay", "yeah", "and", "the", "a", "i"];
const top: Record<string, number> = {}; for (const m of Object.values(byClip)) for (const [e, s] of Object.entries(m)) if (NINE(e)) for (const w of s) top[w] = (top[w] ?? 0) + 1;
console.log(JSON.stringify({ insertedWordTypes: total, sharedBy4plus: shared, onlyThisEngine: solo, perEngine: all, commonInserted: Object.entries(top).sort((a, b) => b[1] - a[1]).slice(0, 15), fill }));
