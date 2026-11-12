/**
 * Builds the public leaderboard from one run's results.json:
 *
 *   npm run leaderboard -- --run results/2026-10-08-oct1 [--preview]
 *       [--codeswitch results/<folder>] [--no-gate results/<a>,results/<b>]
 *
 * --no-gate takes runs of the gated engine (Whisper) made with the client
 * VAD gate off. The page then carries both views and a switch between them,
 * opening with the gate off so every engine is compared on the same audio.
 *
 * Writes site/index.html (self-contained) and site/README.md (Hugging Face
 * Space settings). Only aggregates are used; self-hosted deployment ids are
 * replaced with a generic description.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { ROOT } from "../src/profile";

const arg = (n: string) => {
	const i = process.argv.indexOf(`--${n}`);
	return i >= 0 ? process.argv[i + 1] : undefined;
};
const runDir = arg("run");
if (!runDir) {
	console.error("Usage: npm run leaderboard -- --run results/<folder> [--preview]");
	process.exit(1);
}
const preview = process.argv.includes("--preview");
const csPath = arg("codeswitch");
const noGatePaths = (arg("no-gate") ?? "").split(",").filter(Boolean);

type Interval = { value: number; lo: number; hi: number; speakers: number };
type Agg = Record<string, { headline?: Interval; formatted?: number; nonSpeechOutputRate?: number; languageNotSupported?: boolean } & Record<string, unknown>>;
type Results = {
	date: string;
	runDates?: string[];
	options?: { gate?: boolean };
	sets: { id: string; language: string; condition: string; source: string }[];
	models: Record<string, string>;
	labels: Record<string, string>;
	aggregates: Agg;
};

const r = JSON.parse(readFileSync(resolve(ROOT, runDir, "results.json"), "utf-8")) as Results;
type CsAgg = Record<string, { fair: number; languageLost: number; englishLost?: number; otherLost?: number }>;
const cs = csPath ? (JSON.parse(readFileSync(resolve(ROOT, csPath, "codeswitch.json"), "utf-8")) as { date: string; engines: { id: string; label: string }[]; aggregates: CsAgg }) : null;
const engines = Object.keys(r.labels);

const SET_NAMES: Record<string, string> = {
	"en-dictation": "Clean",
	"en-dictation-noise": "Background noise",
	"en-dictation-whisper": "Whispered",
	"ar-eg": "Arabic, Egyptian",
	"ar-sa": "Arabic, Najdi",
	"ar-ae": "Arabic, Emirati",
	"de-de": "German",
	"es-419": "Spanish, Latin American",
	"es-es": "Spanish, Spain",
	"es-pr": "Spanish, Puerto Rico",
	"fr-fr": "French",
	"hi-in": "Hindi",
	"ur-pk": "Urdu",
	"zh-cn": "Mandarin Chinese",
};

const publicModel = (e: string) => (r.models[e]?.startsWith("baseten:") || r.models[e]?.startsWith("self-hosted") ? "Self-hosted streaming deployment" : r.models[e]);

// Without the gate: the gated engines' aggregates come from the --no-gate runs, everything else is unchanged.
const ungated: string[] = [];
const offAgg: Agg = { ...r.aggregates };
for (const p of noGatePaths) {
	const n = JSON.parse(readFileSync(resolve(ROOT, p, "results.json"), "utf-8")) as Results;
	if (n.options?.gate !== false) throw new Error(`${p} was run with the gate on`);
	for (const e of Object.keys(n.labels)) {
		if (!engines.includes(e)) continue;
		ungated.push(e);
		for (const [k, v] of Object.entries(n.aggregates)) if (k.endsWith(`/${e}`)) offAgg[k] = v;
	}
}

const view = (A: Agg) => ({
	english: ["en-dictation", "en-dictation-noise", "en-dictation-whisper"].filter((s) => r.sets.some((x) => x.id === s)).map((s) => ({
		id: s,
		name: SET_NAMES[s],
		rows: engines.map((e) => ({ engine: e, ...(A[`${s}/${e}`] ?? {}) })),
	})),
	languages: r.sets.filter((s) => !s.id.startsWith("en-dictation") && s.id !== "nonspeech").map((s) => ({
		id: s.id,
		name: SET_NAMES[s.id] ?? s.id,
		cer: s.language === "zh",
		cells: engines.map((e) => {
			const a = A[`${s.id}/${e}`] ?? {};
			return { engine: e, value: a.headline?.value ?? null, unsupported: !!a.languageNotSupported };
		}),
	})),
	nonspeech: r.sets.some((s) => s.id === "nonspeech") ? engines.map((e) => ({ engine: e, rate: A[`nonspeech/${e}`]?.nonSpeechOutputRate ?? null })) : null,
	latency: engines.map((e) => ({ engine: e, ...(A[`latency/${e}`] ?? {}) })),
	failures: engines.map((e) => ({ engine: e, ...(A[`failures/${e}`] ?? {}) })),
});

const data = {
	date: r.date,
	runDates: r.runDates ?? [],
	preview,
	engines: engines.map((e) => ({ id: e, label: r.labels[e], model: publicModel(e) })),
	ungated,
	views: { on: view(r.aggregates), ...(ungated.length ? { off: view(offAgg) } : {}) },
	codeswitch: cs
		? {
				date: cs.date,
				engines: cs.engines,
				rows: (["english", "pair"] as const).flatMap((kind) =>
					(["both", "en", "auto"] as const)
						.filter((st) => cs.engines.some((e) => cs.aggregates[`${kind}/${st}/${e.id}`]))
						.map((st) => ({ kind, setting: st, cells: cs.engines.map((e) => cs.aggregates[`${kind}/${st}/${e.id}`] ?? null) })),
				),
			}
		: null,
};

const label = (e: string) => r.labels[e] ?? e;
const listOf = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);
const fmtDate = (d: string) => new Date(`${d}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const runLabel = data.runDates.length ? data.runDates.map(fmtDate).join(", ") : fmtDate(data.date);

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Streaming Dictation ASR Benchmark</title>
<meta name="description" content="A speech recognition benchmark for dictation: audio is streamed in real time through a dictation client's audio handling, and scored on what the person actually receives.">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&family=Fraunces:opsz,wght,SOFT@9..144,400;9..144,500,70&display=swap">
<style>
:root{--bg:#FFFDF5;--ink:#0F0F0F;--body:#2B2A26;--muted:#7A776D;--rule:#E9E5D6;--soft:#F5F1E3;--gold:#E0B300;--gold-ink:#8A6A00;--bar:#0F0F0F;--ci:#D9D3BE;
--display:"Fraunces",Georgia,serif;--sans:"DM Sans",system-ui,-apple-system,sans-serif}
@media (prefers-color-scheme:dark){:root{--bg:#121210;--ink:#F3F0E6;--body:#D9D5C8;--muted:#97938A;--rule:#2C2B26;--soft:#1C1B17;--gold:#F0C640;--gold-ink:#F0C640;--bar:#F3F0E6;--ci:#4A4840;color-scheme:dark}}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--body);font:16px/1.6 var(--sans);-webkit-font-smoothing:antialiased;padding:0 20px 80px}
.wrap{max-width:980px;margin:0 auto}
a{color:var(--ink)}
h1{font:400 clamp(34px,5vw,48px)/1.1 var(--display);font-variation-settings:"SOFT" 70;color:var(--ink);letter-spacing:-.02em;margin:28px 0 12px}
.lede{font-size:18px;color:var(--muted);max-width:62ch;margin:0 0 18px}
.meta{font-size:13.5px;color:var(--muted);margin:0 0 28px}
.preview{background:var(--soft);border-left:3px solid var(--gold);padding:12px 16px;font-size:14.5px;margin:0 0 36px;border-radius:0 6px 6px 0}
h2{font:500 26px/1.2 var(--display);font-variation-settings:"SOFT" 70;color:var(--ink);margin:56px 0 8px}
.sub{color:var(--muted);margin:0 0 18px;max-width:70ch;font-size:15px}
.tabs{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 14px}
.tab{font:500 14px/1 var(--sans);padding:9px 14px;border:1px solid var(--rule);border-radius:999px;background:transparent;color:var(--body);cursor:pointer}
.tab[aria-selected="true"]{background:var(--ink);color:var(--bg);border-color:var(--ink)}
.tab:focus-visible{outline:2px solid var(--gold);outline-offset:2px}
.scroll{overflow-x:auto}
table{border-collapse:collapse;width:100%;font-size:14.5px;font-variant-numeric:tabular-nums}
th,td{padding:12px 10px;border-bottom:1px solid var(--rule);text-align:left;vertical-align:middle}
th{font-weight:500;color:var(--muted);font-size:12.5px;text-transform:uppercase;letter-spacing:.05em}
td.num,th.num{text-align:right;white-space:nowrap}
.rank{color:var(--muted);width:32px}
.eng{font-weight:600;color:var(--ink)}
.model{display:block;font-weight:400;font-size:12.5px;color:var(--muted)}
.bar{position:relative;height:22px;min-width:200px}
.bar .ci{position:absolute;top:9px;height:4px;background:var(--ci);border-radius:2px}
.bar .pt{position:absolute;top:5px;width:12px;height:12px;margin-left:-6px;border-radius:50%;background:var(--bar)}
.bar .pt.best{background:var(--gold)}
.val{font-weight:600;color:var(--ink)}
.ci-t{display:block;font-size:12px;color:var(--muted)}
.heat td.num{min-width:96px}
.heat td.best{font-weight:600;color:var(--ink)}
.heat td.best::after{content:"";display:inline-block;width:6px;height:6px;border-radius:50%;background:var(--gold);margin-left:6px;vertical-align:middle}
.star{color:var(--muted);font-style:italic}
.note{font-size:13.5px;color:var(--muted);margin:10px 0 0;max-width:80ch}
.cmp td:first-child{color:var(--muted);width:24%}
.vad{background:var(--soft);border-radius:10px;padding:14px 16px;margin:0 0 8px;max-width:760px}
.vad-row{display:flex;flex-wrap:wrap;align-items:center;gap:10px 14px;margin:0 0 6px}
.vad-l{font:600 14.5px/1.3 var(--sans);color:var(--ink)}
.vad p{margin:0;font-size:14px;color:var(--muted)}
.seg{display:inline-flex;border:1px solid var(--rule);border-radius:999px;padding:2px;gap:2px;background:var(--bg)}
.seg button{font:500 13.5px/1 var(--sans);border:0;background:none;color:var(--muted);padding:7px 14px;border-radius:999px;cursor:pointer}
.seg button[aria-pressed="true"]{background:var(--ink);color:var(--bg)}
.seg button:focus-visible{outline:2px solid var(--gold);outline-offset:2px}
.tests{display:grid;grid-template-columns:repeat(3,1fr);gap:22px 28px}
@media (max-width:820px){.tests{grid-template-columns:1fr 1fr}}
@media (max-width:540px){.tests{grid-template-columns:1fr}}
.test{border-top:2px solid var(--ink);padding-top:10px}
.test h3{font:600 15px/1.3 var(--sans);color:var(--ink);margin:0 0 6px}
.test p{margin:0;font-size:14px;color:var(--body)}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:28px}
@media (max-width:720px){.grid{grid-template-columns:1fr}}
.card{border-top:2px solid var(--ink);padding-top:10px}
.card h3{font:600 15px/1.3 var(--sans);color:var(--ink);margin:0 0 6px}
.card p{margin:0;font-size:14.5px}
footer{margin-top:64px;padding-top:18px;border-top:1px solid var(--rule);font-size:13px;color:var(--muted)}
</style>
</head>
<body>
<div class="wrap">
<h1>Streaming Dictation ASR Benchmark</h1>
<p class="lede">A speech recognition benchmark for dictation. Each recording is streamed in real time through a dictation client's audio handling, and scored on what the person actually receives.</p>
<p class="meta">Run: ${runLabel} · ${data.engines.length} engines · Lower error rates are better · 95% intervals</p>
${data.views.off ? `<div class="vad"><div class="vad-row"><span class="vad-l">Voice check on ${listOf(data.ungated.map((e) => label(e)))}</span><div class="seg" role="group" aria-label="Voice check"><button type="button" data-v="off" aria-pressed="true">Off</button><button type="button" data-v="on" aria-pressed="false">On</button></div></div><p>In the gated setup, ${listOf(data.ungated.map((e) => label(e)))} ${data.ungated.length === 1 ? "sits" : "sit"} behind a voice-activity check that holds back audio it judges to be silence. Off shows every engine on the same audio. On shows ${data.ungated.length === 1 ? "it" : "them"} with the voice-activity check on. The other engines are not affected.</p></div>` : ""}
${data.preview ? `<div class="preview"><b>Preview.</b> These results come from a run on ${runLabel}, rescored with the current method. They will be replaced by a full same-day run of every engine.</div>` : ""}

<section>
<h2>What this benchmark tests</h2>
<p class="sub">Multilingual dictation is a core part of the benchmark, tested one language at a time and with two languages in the same recording.</p>
<div class="tests">
<div class="test"><h3>Clean dictation</h3><p>English dictation written for real apps (chat, email, notes and prompts for AI tools), read in a quiet room.</p></div>
<div class="test"><h3>Background noise</h3><p>The same scripts with steady background noise, as in a normal office or home.</p></div>
<div class="test"><h3>Whispered speech</h3><p>The same scripts whispered. Shows whether quiet speech is transcribed, or dropped before it reaches the engine.</p></div>
<div class="test"><h3>Separate languages</h3><p>11 sets, including three Arabic dialects (Egyptian, Najdi, Emirati) and three Spanish varieties, scored separately rather than as one average.</p></div>
<div class="test"><h3>Two languages in one recording</h3><p>English plus another language, and pairs of two non-English languages, switching mid-recording. Played with both languages selected, English only, and auto-detect.</p></div>
<div class="test"><h3>Silence and unsupported languages</h3><p>Whether an engine invents text when nobody spoke, and what a person gets when they choose a language the engine has no setting for.</p></div>
</div>
</section>

<section>
<h2>English dictation</h2>
<p class="sub">Dictation written for real apps (chat, email, notes and prompts for AI tools), read aloud. Error rates exclude punctuation and capitalization; the formatted rate includes them.</p>
<div class="tabs" role="tablist" id="en-tabs"></div>
<div class="scroll"><table id="en-table"><thead><tr><th class="rank">#</th><th>Engine</th><th>Error rate</th><th></th><th class="num">Formatted</th></tr></thead><tbody></tbody></table></div>
<p class="note">Dots show the error rate; bars show the 95% interval. Speaker labels are not yet complete, so intervals are resampled by clip and are narrower than they should be.</p>
</section>

<section>
<h2>Languages</h2>
<p class="sub">Each language and dialect is scored on its own: an engine can be strong in Egyptian Arabic and weak in Emirati Arabic, which a single "Arabic" score would hide. Clips are short read sentences drawn from open datasets, about two minutes of audio per language, so treat these as indicative.</p>
<div class="scroll"><table class="heat" id="lang-table"></table></div>
<p class="note">Mandarin is scored by Mixed Error Rate (each character, or each run of Latin letters, is one unit). <span class="star">Italic</span>: the engine has no option for this language, so none was sent and it auto-detected. That is what a person choosing the language gets, not the engine's accuracy with the language set.</p>
</section>

<section>
<h2>Two languages in one recording</h2>
<p class="sub">Many people switch languages mid-dictation. Each test recording joins a clip in one language to a clip in another, and is played under the language settings a person can choose. The question is whether both languages appear in the transcript, or one disappears. A recording counts only if each engine transcribes both clips correctly when they are played separately, so a lost language is caused by the switch itself.</p>
${data.codeswitch ? `<div class="scroll"><table id="cs-table"></table></div><p class="note">Share of recordings where one language was lost (under 20% of its words in the transcript). Lower is better. Run on ${listOf(data.codeswitch?.engines.map((e) => e.label) ?? [])} so far. Whisper was run with the voice check on for this test.</p>` : `<p class="note">Results for this test will appear after the next full run.</p>`}
</section>

<section>
<h2>Speed</h2>
<p class="sub">Wait is the time from the end of the audio to the final transcript, the delay a person feels after speaking. Connect is the time to open a session, which an app can hide by connecting early.</p>
<div class="scroll"><table id="lat-table"><thead><tr><th>Engine</th><th class="num">Wait, median</th><th class="num">Wait, p90</th><th class="num">Connect, median</th><th class="num">Connect, p90</th></tr></thead><tbody></tbody></table></div>
</section>

<section>
<h2>Reliability</h2>
<p class="sub">Recordings that never reached the engine because the client's voice-activity detection heard no speech, and recordings that failed to connect or complete.</p>
<div class="scroll"><table id="fail-table"><thead><tr><th>Engine</th><th class="num">Recordings</th><th class="num">Dropped before the engine</th><th class="num">Failed</th></tr></thead><tbody></tbody></table></div>
${data.views.on.nonspeech ? `<h3 style="margin-top:28px">Text returned on silence</h3><div class="scroll"><table id="ns-table"></table></div>` : `<p class="note">Output on silence and noise is measured from the next run onward.</p>`}
</section>

<section>
<h2>How it is measured</h2>
<div class="scroll"><table class="cmp">
<thead><tr><th></th><th>Typical benchmarks</th><th>This benchmark</th></tr></thead>
<tbody>
<tr><td>What is tested</td><td>The model, given complete files or a direct stream</td><td>The whole path: real-time streaming through the client's audio handling, including voice-activity detection</td></tr>
<tr><td>Failures before the model</td><td>Not visible</td><td>Reported</td></tr>
<tr><td>Test audio</td><td>Read sentences, broadcasts, meetings, calls</td><td>Dictation written for real apps: clean, with background noise, and whispered</td></tr>
<tr><td>Scoring</td><td>Punctuation and capitals removed; numbers normalized</td><td>Also scored with punctuation and capitals; numbers scored as written</td></tr>
<tr><td>Latency</td><td>Throughput or median speed</td><td>Wait after the last word and connection time, median and 90th percentile</td></tr>
</tbody></table></div>
<div class="grid" style="margin-top:28px">
<div class="card"><h3>Private test audio</h3><p>The recordings and transcripts are not released, so engines cannot be tuned to the test. The method and set descriptions are published.</p></div>
<div class="card"><h3>Current limits</h3><p>99 minutes of speech. English comes from a small number of speakers, and each other language has about two minutes. Public dataset clips may appear in some engines' training data.</p></div>
</div>
</section>

<section>
<h2>Submit an engine</h2>
<p class="sub">Engine providers can ask to be scored on the full benchmark. We run every engine under the same conditions and share results with the provider before publishing. Open an issue in the repository to ask.</p>
</section>

<footer>Streaming Dictation ASR Benchmark · Results and text licensed under CC BY 4.0 · Engines: ${data.engines.map((e) => `${e.label} (${e.model})`).join("; ")}</footer>
</div>
<script id="data" type="application/json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>
<script>
(function(){
var D=JSON.parse(document.getElementById("data").textContent);
var label={};D.engines.forEach(function(e){label[e.id]=e;});
var pct=function(x){return x==null?"–":(x*100).toFixed(1)+"%";};
var mode=D.views.off?"off":"on",enTab=0;
var V=function(){return D.views[mode];};
var gated=function(id){return mode==="off"&&D.ungated.indexOf(id)>=0;};
var tag=function(id){return gated(id)?'<span class="model">without the voice check</span>':'';};
function enTable(i){
  enTab=i;var set=V().english[i];var rows=set.rows.filter(function(r){return r.headline;}).sort(function(a,b){return a.headline.value-b.headline.value;});
  var max=Math.max.apply(null,rows.map(function(r){return r.headline.hi;}))*1.05||1;
  var tb=document.querySelector("#en-table tbody");tb.innerHTML="";
  rows.forEach(function(r,k){
    var h=r.headline,e=label[r.engine];
    var tr=document.createElement("tr");
    tr.innerHTML='<td class="rank">'+(k+1)+'</td><td><span class="eng">'+e.label+'</span><span class="model">'+e.model+'</span>'+tag(r.engine)+'</td>'+
      '<td class="num"><span class="val">'+pct(h.value)+'</span><span class="ci-t">'+pct(h.lo)+' – '+pct(h.hi)+'</span></td>'+
      '<td style="width:40%"><div class="bar"><div class="ci" style="left:'+(h.lo/max*100)+'%;width:'+((h.hi-h.lo)/max*100)+'%"></div><div class="pt'+(k===0?' best':'')+'" style="left:'+(h.value/max*100)+'%"></div></div></td>'+
      '<td class="num">'+pct(r.formatted)+'</td>';
    tb.appendChild(tr);
  });
  [].forEach.call(document.querySelectorAll("#en-tabs .tab"),function(t,j){t.setAttribute("aria-selected",j===i?"true":"false");});
}
var tabs=document.getElementById("en-tabs");
V().english.forEach(function(s,i){var b=document.createElement("button");b.className="tab";b.setAttribute("role","tab");b.textContent=s.name;b.onclick=function(){enTable(i);};tabs.appendChild(b);});
function langTable(){
var lt=document.getElementById("lang-table");
var head='<thead><tr><th>Language</th>'+D.engines.map(function(e){return '<th class="num">'+e.label+(gated(e.id)?'<span class="ci-t">no voice check</span>':'')+'</th>';}).join("")+'</tr></thead><tbody>';
lt.innerHTML=head+V().languages.map(function(l){
  var ok=l.cells.filter(function(c){return c.value!=null&&!c.unsupported;});
  var min=Math.min.apply(null,ok.map(function(c){return c.value;}));
  return '<tr><td>'+l.name+'</td>'+l.cells.map(function(c){
    var cls="num"+(c.unsupported?" star":"")+(!c.unsupported&&c.value===min?" best":"");
    return '<td class="'+cls+'">'+pct(c.value)+'</td>';}).join("")+'</tr>';
}).join("")+'</tbody>';}
function latTable(){
var lat=document.querySelector("#lat-table tbody");lat.innerHTML="";
V().latency.slice().sort(function(a,b){return (a.waitP50||0)-(b.waitP50||0);}).forEach(function(r){
  var tr=document.createElement("tr");
  tr.innerHTML='<td><span class="eng">'+label[r.engine].label+'</span>'+tag(r.engine)+'</td><td class="num">'+r.waitP50+' ms</td><td class="num">'+r.waitP90+' ms</td><td class="num">'+r.connectP50+' ms</td><td class="num">'+r.connectP90+' ms</td>';
  lat.appendChild(tr);
});}
function failTable(){
var ft=document.querySelector("#fail-table tbody");ft.innerHTML="";
V().failures.forEach(function(r){
  var tr=document.createElement("tr");
  tr.innerHTML='<td><span class="eng">'+label[r.engine].label+'</span>'+tag(r.engine)+'</td><td class="num">'+r.clips+'</td><td class="num">'+r.dropped+'</td><td class="num">'+r.failed+'</td>';
  ft.appendChild(tr);
});}
function nsTable(){
var ns=document.getElementById("ns-table");var N=V().nonspeech;
if(ns&&N){ns.innerHTML='<thead><tr>'+N.map(function(r){return '<th class="num">'+label[r.engine].label+'</th>';}).join("")+'</tr></thead><tbody><tr>'+N.map(function(r){return '<td class="num">'+pct(r.rate)+'</td>';}).join("")+'</tr></tbody>';}}
function renderAll(){enTable(enTab);langTable();latTable();failTable();nsTable();}
[].forEach.call(document.querySelectorAll(".vad .seg button"),function(b){b.onclick=function(){mode=b.getAttribute("data-v");
  [].forEach.call(document.querySelectorAll(".vad .seg button"),function(x){x.setAttribute("aria-pressed",String(x===b));});renderAll();};});
renderAll();
var cst=document.getElementById("cs-table");
if(cst&&D.codeswitch){var C=D.codeswitch;var KN={english:"English + another language",pair:"Two non-English languages"};var SN={both:"Both languages selected",en:"English only selected",auto:"Auto-detect"};
cst.innerHTML='<thead><tr><th>Recordings</th><th>Language setting</th>'+C.engines.map(function(e){return '<th class="num">'+e.label+'</th>';}).join("")+'</tr></thead><tbody>'+C.rows.map(function(r){return '<tr><td>'+KN[r.kind]+'</td><td>'+SN[r.setting]+'</td>'+r.cells.map(function(c){return '<td class="num">'+(c&&c.fair?Math.round(100*c.languageLost/c.fair)+'%<span class="ci-t">of '+c.fair+'</span>':'–')+'</td>';}).join("")+'</tr>';}).join("")+'</tbody>';}
})();
</script>
</body>
</html>
`;

const readme = `---
title: Streaming Dictation ASR Benchmark
emoji: 🍋
colorFrom: yellow
colorTo: gray
sdk: static
pinned: true
license: cc-by-4.0
short_description: Dictation ASR benchmark, streamed in real time
tags:
  - leaderboard
  - asr
  - speech-recognition
  - benchmark
---

# Streaming Dictation ASR Benchmark

A speech recognition benchmark for dictation: audio is streamed in real time
through a dictation client's audio handling, and scored on what the person actually
receives.

Results are aggregates only. Results and text are licensed under CC BY 4.0.
`;

const out = resolve(ROOT, "site");
mkdirSync(out, { recursive: true });
writeFileSync(resolve(out, "index.html"), html);
writeFileSync(resolve(out, "README.md"), readme);
console.log(`site/index.html, site/README.md  (from ${runDir}${preview ? ", preview" : ""})`);
