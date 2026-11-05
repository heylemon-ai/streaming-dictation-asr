/**
 * How much the word-for-word ("said") references depend on the systems that voted for their edits.
 *
 *   cache/normenv/bin/python -I paper/analysis/said_votes.py   # which systems voted for each edit
 *   npx tsx paper/analysis/said_loo.ts > paper/analysis/said_loo.json
 *
 * The said reference is the script plus the edits a listener accepted from the draft (tools/verbatim/draft.py), or a
 * hand-written text for a few messages (overrides). An edit was shown to the listener when at least 3 systems added
 * the same words, or 5 dropped or changed the same word (4 and 6 to be pre-ticked). For each voting system X we
 * rebuild the references without X's votes and rescore X:
 *   - loo:     keep an accepted edit only if the other ten systems alone still reach the threshold at which it was
 *              shown (3 / 5), so the listener would still have seen it; the listener's decision is kept;
 *   - looTick: the same with the pre-tick thresholds (4 / 6);
 *   - noneOfX: drop every accepted edit X voted for (an extreme bound: nothing X heard can help X).
 * Overrides are kept in every variant (they are hand-written and cannot be split into votes). handOnly scores every
 * row against the script, except the override messages, which keep their hand-written text.
 * Transcripts: the main run (cache/clips/2026-10-21-main.tsv), as in verbatim.ts. Only aggregates are written.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { scoreClip, type Score } from "../../src/score";

const ROOT = resolve(import.meta.dirname, "../..");
type Prop = { type: string; at: number; words: string; systems: number; proposed: boolean };
type Clip = { id: string; set: string; script: string[]; proposals: Prop[] };
type Decision = { accepted: Record<string, boolean>; override: string | null; reviewed: boolean };
const draft: { voters: string[]; clips: Clip[] } = JSON.parse(readFileSync(resolve(ROOT, "data/verbatim/draft.json"), "utf-8"));
const decisions: Record<string, Decision> = JSON.parse(readFileSync(resolve(ROOT, "data/verbatim/decisions.json"), "utf-8"));
const votes: Record<string, string[][]> = JSON.parse(readFileSync(resolve(ROOT, "cache/review/said_votes.json"), "utf-8"));
const SHOW: Record<string, number> = { ins: 3, del: 5, sub: 5 }, TICK: Record<string, number> = { ins: 4, del: 6, sub: 6 };

/** The script with the accepted edits that pass `keep` applied (as in verbatim.ts). */
function compose(c: Clip, d: Decision, keep: (i: number) => boolean): string {
	if (d.override != null) return d.override;
	const ins: Record<number, string[]> = {}, at: Record<number, Prop> = {};
	c.proposals.forEach((p, i) => { if (!d.accepted[i] || !keep(i)) return; if (p.type === "ins") (ins[p.at] ??= []).push(p.words); else at[p.at] = p; });
	const out: string[] = [];
	for (let k = 0; k <= c.script.length; k++) {
		out.push(...(ins[k] ?? []));
		if (k === c.script.length) break;
		const p = at[k];
		if (p?.type === "del") continue;
		out.push(p?.type === "sub" ? p.words : c.script[k]);
	}
	return out.join(" ");
}

const clips = draft.clips.filter((c) => decisions[c.id]?.reviewed);

// 1. Where the accepted edits came from.
const accepted = clips.flatMap((c) => c.proposals.map((p, i) => ({ c, p, i, v: votes[c.id][i] })).filter((x) => decisions[c.id].accepted[x.i]));
const perSystem = Object.fromEntries(draft.voters.map((e) => [e, accepted.filter((x) => x.v.includes(e)).length]));
const origin = {
	acceptedEdits: accepted.length,
	acceptedPreTicked: accepted.filter((x) => x.p.proposed).length,
	acceptedUnticked: accepted.filter((x) => !x.p.proposed).length,
	rejectedPreTicked: clips.flatMap((c) => c.proposals.filter((p, i) => p.proposed && !decisions[c.id].accepted[i])).length,
	overrideMessages: clips.filter((c) => decisions[c.id].override != null).length,
	reviewedMessages: clips.length,
	acceptedVotedBy: perSystem,
};

// 2. Rescore.
function readTsv(path: string) {
	const [head, ...lines] = readFileSync(resolve(ROOT, path), "utf-8").split("\n").filter(Boolean);
	const cols = head.split("\t");
	return lines.map((l) => Object.fromEntries(l.split("\t").map((v, i) => [cols[i], v])));
}
const hyp: Record<string, Record<string, string>> = {}; // engine -> clip -> transcript
for (const r of readTsv("cache/clips/2026-10-21-main.tsv")) {
	if (r.run !== "0" || (r.error && !r.error.startsWith("dropped"))) continue;
	(hyp[r.engine] ??= {})[r.clip] = r.error ? "" : r.transcript;
}
const ROWS = [...draft.voters, "gemini-smart", "elevenlabs-scribe-clean"];
const SETS = ["en-dictation", "en-dictation-noise", "en-dictation-whisper"];

type Keep = (c: Clip, i: number) => boolean;
const variants: Record<string, (x: string) => Keep> = {
	full: () => () => true,
	loo: (x) => (c, i) => votes[c.id][i].filter((e) => e !== x).length >= SHOW[c.proposals[i].type],
	looTick: (x) => (c, i) => votes[c.id][i].filter((e) => e !== x).length >= TICK[c.proposals[i].type],
	noneOfX: (x) => (c, i) => !votes[c.id][i].includes(x),
};
const scoresFor = (engine: string, keep: Keep) => Object.fromEntries(SETS.map((s) => [s,
	clips.filter((c) => c.set === s && hyp[engine]?.[c.id] != null)
		.map((c) => scoreClip(compose(c, decisions[c.id], (i) => keep(c, i)), hyp[engine][c.id], "en").headline)]));
const script = (engine: string) => Object.fromEntries(SETS.map((s) => [s,
	clips.filter((c) => c.set === s && hyp[engine]?.[c.id] != null).map((c) => scoreClip(c.script.join(" "), hyp[engine][c.id], "en").headline)]));
const handOnly = (engine: string) => Object.fromEntries(SETS.map((s) => [s,
	clips.filter((c) => c.set === s && hyp[engine]?.[c.id] != null)
		.map((c) => scoreClip(decisions[c.id].override ?? c.script.join(" "), hyp[engine][c.id], "en").headline)]));

const pct = (xs: Score[]) => (100 * xs.reduce((a, s) => a + s.errors, 0)) / Math.max(1, xs.reduce((a, s) => a + s.refLen, 0));
const r1 = (x: number) => +x.toFixed(1);
const wer: Record<string, Record<string, Record<string, number>>> = {}; // engine -> variant -> set -> WER
for (const e of ROWS) {
	const self = draft.voters.includes(e) ? e : "__none__";
	const v: Record<string, Record<string, Score[]>> = { script: script(e), handOnly: handOnly(e) };
	for (const [name, mk] of Object.entries(variants)) v[name] = scoresFor(e, mk(self));
	wer[e] = Object.fromEntries(Object.entries(v).map(([name, bySet]) => [name, Object.fromEntries(SETS.map((s) => [s, r1(pct(bySet[s]))]))]));
}

// 3. Gemini against Gemini Smart and ElevenLabs NV on quiet English: against the full said reference, and against
// the references rebuilt without Gemini's votes (the one voter of the three). Paired percentile bootstrap over clips.
let seed = 11;
// mulberry32: a full-period 32-bit generator (the earlier LCG lost precision in floating point and cycled after about 14,000 draws).
const rnd = () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
function paired(a: Score[], b: Score[]) {
	const n = a.length, d: number[] = [];
	for (let k = 0; k < 2000; k++) {
		const pick = Array.from({ length: n }, () => Math.floor(rnd() * n));
		d.push(pct(pick.map((i) => a[i])) - pct(pick.map((i) => b[i])));
	}
	d.sort((x, y) => x - y);
	return { diff: r1(pct(a) - pct(b)), ci: [r1(d[50]), r1(d[1949])] };
}
const order: Record<string, unknown> = {};
for (const [name, keep] of [["full", variants.full("")], ["loo", variants.loo("gemini")], ["looTick", variants.looTick("gemini")], ["noneOfGemini", variants.noneOfX("gemini")]] as const) {
	const q = (e: string) => scoresFor(e, keep)["en-dictation"];
	const g = q("gemini"), sm = q("gemini-smart"), nv = q("elevenlabs-scribe-clean");
	order[name] = {
		gemini: r1(pct(g)), smart: r1(pct(sm)), nv: r1(pct(nv)),
		geminiMinusSmart: paired(g, sm), geminiMinusNv: paired(g, nv), nvMinusSmart: paired(nv, sm),
	};
}

console.log(JSON.stringify({ origin, wer, quietOrder: order }, null, 1));
