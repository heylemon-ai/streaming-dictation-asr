"""Writes paper/tables/*.tex from the committed result files, so every number in the paper comes from results/."""
import json, os
R = lambda p: json.load(open(p))
# Main comparison: Whisper is represented by the self-hosted deployment (VAD cuts only) and OpenAI's Realtime
# Whisper. The other Whisper setups appear only in the Whisper guide (family, vad tables).
off = R('results/2026-10-21-main/results.json')['aggregates']
fam = R('results/2026-10-21-whisper-family/results.json')['aggregates']            # gated Whisper with its VAD, and the other Whisper setups
fam_off = R('results/2026-10-13-whisper-no-vad/results.json')['aggregates']         # gated Whisper without its VAD
cs = R('results/2026-11-05-codeswitch-main/codeswitch.json')['aggregates']
csf = R('results/2026-10-21-codeswitch-whisper-family/codeswitch.json')['aggregates']
csp = R('results/2026-10-29-codeswitch-elevenlabs-pause/codeswitch.json')['aggregates']  # ElevenLabs finalizing at each pause, same fair recordings
E7 = ['whisper-self-hosted', 'qwen', 'meta', 'gemini', 'gemini-smart', 'deepgram', 'assemblyai-3-6-pro', 'assemblyai-3-5-pro', 'zoom-scribe', 'elevenlabs-scribe', 'elevenlabs-scribe-clean', 'openai-live-transcribe-low', 'openai-realtime-whisper']
SHORT = {'whisper': 'Gated Whisper', 'whisper-self-hosted': 'Whisper SH', 'whisper-self-hosted-vad': 'Whisper SH drop', 'qwen': 'Qwen', 'meta': 'Meta', 'gemini': 'Gemini', 'gemini-smart': 'Gemini Smart', 'deepgram': 'Deepgram', 'assemblyai-3-6-pro': 'AAI 3.6', 'assemblyai-3-5-pro': 'AAI 3.5', 'zoom-scribe': 'Zoom', 'elevenlabs-scribe': 'ElevenLabs', 'elevenlabs-scribe-clean': 'ElevenLabs NV', 'elevenlabs-scribe-vad': 'ElevenLabs pause', 'elevenlabs-scribe-clean-vad': 'ElevenLabs NV pause', 'openai-live-transcribe-low': 'GPT-Live', 'openai-realtime-whisper': 'RT Whisper', 'openai-whisper-1': 'Whisper-1', 'openai-whisper-1-split': 'Whisper-1 split', 'whisper-self-hosted-ten': 'Whisper SH TEN', 'whisper-self-hosted-ten-vad': 'Whisper SH TEN drop'}
os.makedirs('paper/tables', exist_ok=True)
p = lambda x: f'{x*100:.1f}'
hdr = ' & '.join(SHORT[e] for e in E7)

def best_bold(vals, skip=()):
    ok = [v for i, v in enumerate(vals) if v is not None and i not in skip]
    m = min(ok)
    return [(r'\textbf{%s}' % s if v == m and i not in skip else s) for i, (v, s) in enumerate(zip(vals, [p(v) if v is not None else '--' for v in vals]))]

# Table: English conditions with 95% CI (ungated)
rows = []
for s, name in [('en-dictation', 'Quiet'), ('en-dictation-noise', 'Fan on'), ('en-dictation-whisper', 'Whispered')]:
    vals = [off[f'{s}/{e}']['headline']['value'] for e in E7]
    cells = best_bold(vals)
    ci = [f"{{\\scriptsize [{p(off[f'{s}/{e}']['headline']['lo'])}, {p(off[f'{s}/{e}']['headline']['hi'])}]}}" for e in E7]
    rows.append(name + ' & ' + ' & '.join(cells) + r' \\')
    rows.append(' & ' + ' & '.join(ci) + r' \\[2pt]')
langs = ['ar-eg', 'ar-sa', 'ar-ae', 'de-de', 'es-419', 'es-es', 'es-pr', 'fr-fr', 'hi-in', 'zh-cn']
avg = [sum(off[f'{s}/{e}']['headline']['value'] for s in langs) / len(langs) for e in E7]
rows.append(r'Multilingual$^\dagger$ & ' + ' & '.join(best_bold(avg)) + r' \\')
open('paper/tables/english.tex', 'w').write('\n'.join(rows) + '\n')

# Formatted
rows = []
for s, name in [('en-dictation', 'Quiet'), ('en-dictation-noise', 'Fan on'), ('en-dictation-whisper', 'Whispered')]:
    rows.append(name + ' & ' + ' & '.join(best_bold([off[f'{s}/{e}']['formatted'] for e in E7])) + r' \\')
open('paper/tables/formatted.tex', 'w').write('\n'.join(rows) + '\n')

# Languages
NAMES = {'ar-eg': 'Arabic (MSA, Egyptian speakers)', 'ar-sa': 'Arabic (Saudi)', 'ar-ae': 'Arabic (Emirati)', 'de-de': 'German', 'es-419': 'Spanish (Lat.\\ Am.)', 'es-es': 'Spanish (Spain)', 'es-pr': 'Spanish (P.\\ Rico)', 'fr-fr': 'French', 'hi-in': 'Hindi', 'zh-cn': 'Mandarin (MER)', 'ur-pk': 'Urdu'}
rows = []
for s in langs + ['ur-pk']:
    vals = [off[f'{s}/{e}']['headline']['value'] for e in E7]
    skip = {i for i, e in enumerate(E7) if off[f'{s}/{e}'].get('languageNotSupported')}
    cells = best_bold(vals, skip)
    cells = [c + '$^*$' if i in skip else c for i, c in enumerate(cells)]
    rows.append(NAMES[s] + ' & ' + ' & '.join(cells) + r' \\')
open('paper/tables/languages.tex', 'w').write('\n'.join(rows) + '\n')

# Latency
rows = []
for e in E7:
    L = off[f'latency/{e}']
    conn = (L['connectP50'], L['connectP90']) if L['connectP50'] else ('--', '--')  # file uploads open no session
    rows.append(f"{SHORT[e]} & {L['waitP50']} & {L['waitP90']} & {conn[0]} & {conn[1]} \\\\")
open('paper/tables/latency.tex', 'w').write('\n'.join(rows) + '\n')

# Timing runs of 29 October: first finalised text, and the wait net of the round trip (paper/analysis/ttft.py)
TT = json.load(open('paper/analysis/ttft.json'))
rows = []
for e in E7:
    t = TT[e]
    lf = f"{t['liveFirstTextS']:.1f}" if t['liveFirstTextS'] is not None else '--'
    rows.append(f"{SHORT[e]} & {t['livePct']} & {lf} & {t['waitP50']} & {t['rttP50']} & {t['waitMinusRtt']} \\\\")
open('paper/tables/timing.tex', 'w').write('\n'.join(rows) + '\n')

# VAD ablation, Whisper only: the client puts the voice check in front of gated Whisper alone (paired bootstrap computed in the article analysis)
IV = json.load(open('paper/analysis/intervals.json'))  # npx tsx paper/analysis/intervals.ts > paper/analysis/intervals.json
DIFF = {'whisper': {s: (v['diff']['value'], *v['diff']['ci']) for s, v in IV['vad'].items()}}
rows = []
for e in ['whisper']:
    for s, name in [('en-dictation', 'Quiet'), ('en-dictation-noise', 'Fan on'), ('en-dictation-whisper', 'Whispered'), ('ar-ae', 'Arabic (Emirati)')]:
        d = DIFF[e][s]
        rows.append(f"{SHORT[e] if s=='en-dictation' else ''} & {name} & {p(fam[f'{s}/{e}']['headline']['value'])} & {p(fam_off[f'{s}/{e}']['headline']['value'])} & {d[0]:+.1f} & [{d[1]:+.1f}, {d[2]:+.1f}] \\\\")
    wd = lambda agg: 100 * agg[f'failures/{e}']['droppedSets'].count('en-dictation-whisper') / 16
    rows.append(f"{'' } & Whispered clips never sent & {wd(fam):.1f} & {wd(fam_off):.1f} & & \\\\[3pt]")
open('paper/tables/vad.tex', 'w').write('\n'.join(rows) + '\n')

# Code-switching
CE = ['whisper-self-hosted', 'qwen', 'meta', 'gemini', 'gemini-smart', 'deepgram', 'assemblyai-3-6-pro', 'assemblyai-3-5-pro', 'zoom-scribe', 'elevenlabs-scribe', 'elevenlabs-scribe-clean', 'elevenlabs-scribe-vad', 'elevenlabs-scribe-clean-vad', 'openai-live-transcribe-low', 'openai-realtime-whisper']
cs.update({k: v for k, v in csp.items() if k.endswith('-vad')})
assert all(v['fair'] == cs[k.split('/')[0] + '/both/gemini']['fair'] for k, v in csp.items())  # same recordings as the main run
# Two-line column names, so the 14 columns stay readable at page width.
TWO = {'elevenlabs-scribe-clean': 'ElevenLabs\\\\NV', 'elevenlabs-scribe-vad': 'ElevenLabs\\\\pause', 'elevenlabs-scribe-clean-vad': 'ElevenLabs\\\\NV pause', 'gemini-smart': 'Gemini\\\\Smart', 'whisper-self-hosted': 'Whisper\\\\SH', 'openai-realtime-whisper': 'RT\\\\Whisper'}
open('paper/tables/cs_header.tex', 'w').write(' & '.join(r'\shortstack[r]{%s}' % TWO.get(e, SHORT[e]) for e in CE))
open('paper/tables/cs_header_all.tex', 'w').write(hdr)
# Main table: every recording (100 EN + X, 300 X + Y). The filtered table (cs_fair.tex, appendix) keeps only the
# recordings whose parts every system handles alone, and adds the ElevenLabs runs that finalise at each pause.
CSALL = json.load(open('paper/analysis/extras.json'))['csAll']  # npx tsx paper/analysis/extras.ts > paper/analysis/extras.json
CEA = [e for e in CE if not e.endswith('-vad')]
def cs_rows(engines, share):
    out = []
    for kind, kn in [('english', 'EN + X'), ('pair', 'X + Y')]:
        for st, sn in [('both', 'Both selected'), ('en', 'English only'), ('auto', 'Auto-detect')]:
            if f'{kind}/{st}/gemini' not in cs: continue
            vals = [share(kind, st, e) for e in engines]
            m = min(vals)
            cells = [(r'\textbf{%d}' if v == m else '%d') % int(v * 100 + 0.5) for v in vals]  # round half up, as in the article
            out.append(f"{kn if st=='both' else ''} & {sn} & " + ' & '.join(cells) + r' \\')
    return out
open('paper/tables/cs_header_main.tex', 'w').write(' & '.join(r'\shortstack[r]{%s}' % TWO.get(e, SHORT[e]) for e in CEA))
open('paper/tables/codeswitch_all.tex', 'w').write('\n'.join(cs_rows(CEA, lambda k, st, e: CSALL[f'{k}/{st}'][e]['lostAll'] / CSALL[f'{k}/{st}'][e]['all'])) + '\n')
rows = cs_rows(CE, lambda k, st, e: cs[f'{k}/{st}/{e}']['languageLost'] / cs[f'{k}/{st}/{e}']['fair'])
open('paper/tables/codeswitch.tex', 'w').write('\n'.join(rows) + '\n')

# The same two tables with one row per system, so they fit the page at a readable size.
LONG = {'elevenlabs-scribe-vad': 'ElevenLabs, pause', 'elevenlabs-scribe-clean-vad': 'ElevenLabs NV, pause'}
def cs_rows_t(engines, share):
    cols = [(k, st) for k in ('english', 'pair') for st in ('both', 'en', 'auto') if f'{k}/{st}/gemini' in cs]
    vals = {e: [share(k, st, e) for k, st in cols] for e in engines}
    mins = [min(vals[e][i] for e in engines) for i in range(len(cols))]
    return [f"{LONG.get(e, SHORT[e])} & " + ' & '.join((r'\textbf{%d}' if v == mins[i] else '%d') % int(v * 100 + 0.5) for i, v in enumerate(vals[e])) + r' \\' for e in engines]
open('paper/tables/codeswitch_all_t.tex', 'w').write('\n'.join(cs_rows_t(CEA, lambda k, st, e: CSALL[f'{k}/{st}'][e]['lostAll'] / CSALL[f'{k}/{st}'][e]['all'])) + '\n')
open('paper/tables/codeswitch_t.tex', 'w').write('\n'.join(cs_rows_t(CE, lambda k, st, e: cs[f'{k}/{st}/{e}']['languageLost'] / cs[f'{k}/{st}/{e}']['fair'])) + '\n')

# Overall tables for the portrait pages: one row per system (the 13 columns of the tables above did not fit).
def col_bold(vals, skip=()):
    """Bold the lowest value in a column; skipped rows (no option for the language) are not ranked."""
    ok = [v for i, v in enumerate(vals) if i not in skip]
    return [i not in skip and v == min(ok) for i, v in enumerate(vals)]
EN = [('en-dictation', 'Quiet'), ('en-dictation-noise', 'Fan on'), ('en-dictation-whisper', 'Whispered')]
wer = {s: [off[f'{s}/{e}']['headline']['value'] for e in E7] for s, _ in EN}
fmt = {s: [off[f'{s}/{e}']['formatted'] for e in E7] for s, _ in EN}
# Bold only where the lowest row is clearly lower than the next (paired bootstrap, paper/analysis/extras.json).
XB = json.load(open('paper/analysis/extras.json'))['enBest']
clear = lambda s, kind: [XB[f'{s}/{kind}']['clear'] and e == XB[f'{s}/{kind}']['best'] for e in E7]
bw = {s: clear(s, 'headline') for s, _ in EN}; bf = {s: clear(s, 'formatted') for s, _ in EN}; ba = col_bold(avg)
# The same average with Urdu: a wrong-alphabet answer is a real failure for the user, so report both.
avg_u = [sum(off[f'{s}/{e}']['headline']['value'] for s in langs + ['ur-pk']) / (len(langs) + 1) for e in E7]
bau = col_bold(avg_u)
B = lambda txt, on: r'\textbf{%s}' % txt if on else txt
rows = []
for i, e in enumerate(E7):
    cells = []
    for s, _ in EN:
        h = off[f'{s}/{e}']['headline']
        cells.append(B(p(h['value']), bw[s][i]) + r' {\scriptsize [%s, %s]}' % (p(h['lo']), p(h['hi'])))
    cells += [B(p(fmt[s][i]), bf[s][i]) for s, _ in EN]
    rows.append(SHORT[e] + ' & ' + ' & '.join(cells) + r' \\')
open('paper/tables/overall_en.tex', 'w').write('\n'.join(rows) + '\n')

LHEAD = {'ar-eg': r'Arabic MSA\\(Egypt)', 'ar-sa': r'Arabic\\Saudi', 'ar-ae': r'Arabic\\Emirati', 'de-de': r'\\German', 'es-419': r'Spanish\\Lat.\ Am.', 'es-es': r'Spanish\\Spain', 'es-pr': r'Spanish\\P.\ Rico', 'fr-fr': r'\\French', 'hi-in': r'\\Hindi', 'zh-cn': r'Mandarin\\(MER)', 'ur-pk': r'\\Urdu'}
L11 = langs + ['ur-pk']
open('paper/tables/overall_lang_header.tex', 'w').write(' & '.join(r'\shortstack[r]{%s}' % LHEAD[s] for s in L11) + r' & \shortstack[r]{Avg.\\no Urdu} & \shortstack[r]{Avg.\\with Urdu}')
lv = {s: [off[f'{s}/{e}']['headline']['value'] for e in E7] for s in L11}
lskip = {s: {i for i, e in enumerate(E7) if off[f'{s}/{e}'].get('languageNotSupported')} for s in L11}
# No bold: in no set is the lowest row clearly lower than the next (paired bootstrap, paper/analysis/extras.json).
lb = {s: [False] * len(E7) for s in L11}
rows = [SHORT[e] + ' & ' + ' & '.join(B(p(lv[s][i]), lb[s][i]) + ('$^*$' if i in lskip[s] else '') for s in L11) + f' & {p(avg[i])} & {p(avg_u[i])}' + r' \\' for i, e in enumerate(E7)]
open('paper/tables/overall_lang.tex', 'w').write('\n'.join(rows) + '\n')

# Messages that need no edit (paper/analysis/extras.json, npx tsx paper/analysis/extras.ts).
X = json.load(open('paper/analysis/extras.json'))
rows = []
for e in E7:
    cells = []
    for s, _ in EN:
        a = X['noEdit'][s][e]
        cells += [f"{100 * a['noWordError'] / a['clips']:.0f}", f"{100 * a['noFormattedError'] / a['clips']:.0f}"]
    rows.append(SHORT[e] + ' & ' + ' & '.join(cells) + r' \\')
open('paper/tables/noedit.tex', 'w').write('\n'.join(rows) + '\n')

# WER against the reviewed word-for-word references, next to the script (paper/analysis/verbatim.json,
# npx tsx paper/analysis/verbatim.ts). Same thirteen rows as Table 2.
VB = json.load(open('paper/analysis/verbatim.json'))['wer']
rows = []
for e in E7:
    cells = []
    for s, _ in EN:
        v = VB[s][e]
        cells += [f"{v['script']:.1f}", f"{v['said']:.1f} {{\\scriptsize [{v['saidCI'][0]:.1f}, {v['saidCI'][1]:.1f}]}}"]
    rows.append(SHORT[e] + ' & ' + ' & '.join(cells) + r' \\')
open('paper/tables/verbatim.tex', 'w').write('\n'.join(rows) + '\n')
# Rank agreement quoted in Section 4 (script vs said, the thirteen table rows, average ranks for ties).
def _rank(xs):
    o = sorted(range(len(xs)), key=lambda i: xs[i]); r = [0.0] * len(xs); k = 0
    while k < len(o):
        j = k
        while j + 1 < len(o) and xs[o[j + 1]] == xs[o[k]]: j += 1
        for t in range(k, j + 1): r[o[t]] = (k + j) / 2
        k = j + 1
    return r
def _spearman(a, b):
    ra, rb = _rank(a), _rank(b); ma, mb = sum(ra) / len(ra), sum(rb) / len(rb)
    num = sum((x - ma) * (y - mb) for x, y in zip(ra, rb))
    return num / (sum((x - ma) ** 2 for x in ra) * sum((y - mb) ** 2 for y in rb)) ** 0.5
print('verbatim rank agreement', {s_: round(_spearman([VB[s_][e]['script'] for e in E7], [VB[s_][e]['said'] for e in E7]), 2) for s_ in ('en-dictation', 'en-dictation-noise', 'en-dictation-whisper')})

# English WER with numbers and spellings normalised (paper/analysis/normwer.json, Whisper's English normaliser).
NW = json.load(open('paper/analysis/normwer.json'))['wer']
rows = []
for e in E7:
    rows.append(SHORT[e] + ' & ' + ' & '.join(f"{NW[s][e]['norm']:.1f}" for s, _ in EN) + r' \\')
open('paper/tables/normwer.tex', 'w').write('\n'.join(rows) + '\n')

print('fair counts', cs['english/both/gemini']['fair'], cs['pair/both/gemini']['fair'])

# ---------------------------------------------------------------------------
# Failure-analysis tables, from paper/analysis/failures.json (npx tsx paper/analysis/failures.ts)
F = json.load(open('paper/analysis/failures.json'))
O = F['out']
pc = lambda a, b: f'{100*a/b:.0f}' if b else '--'

# Whispered speech: how it fails
rows = []
for e in E7:
    t = O['tails:en-dictation-whisper'][e]; s = O['spans:en-dictation-whisper'][e]; m = O['mix:en-dictation-whisper'][e]
    rows.append(f"{SHORT[e]} & {p(off[f'en-dictation-whisper/{e}']['headline']['value'])} & {pc(t.get('ge50',0), t['clips'])} & {pc(t.get('ge90',0), t['clips'])} & {pc(s.get('end',0), s['clips'])} & {pc(s.get('tailcut',0), s['clips'])} \\\\")
open('paper/tables/f_whisper.tex', 'w').write('\n'.join(rows) + '\n')

# Numbers
rows = []
for e in E7:
    n = O['numbers'][e]
    tot = sum(O['mix:' + g][e].get(k, 0) for g in ['en-dictation', 'en-dictation-noise', 'en-dictation-whisper'] for k in ['sub', 'del', 'ins'])
    rows.append(f"{SHORT[e]} & {pc(n.get('digitHit',0), n['digitRef'])} & {pc(n.get('digitAsWord',0), n['digitRef'])} & {pc(n.get('wordHit',0), n['wordRef'])} & {pc(n.get('wordAsDigit',0), n['wordRef'])} & {100*(n.get('digitAsWord',0)+n.get('wordAsDigit',0))/tot:.1f} \\\\")
open('paper/tables/f_numbers.tex', 'w').write('\n'.join(rows) + '\n')
NUMREF = (O['numbers']['gemini']['digitRef'], O['numbers']['gemini']['wordRef'])

# Names and invented words
INSJ = json.load(open('paper/analysis/insertions.json'))  # npx tsx paper/analysis/insertions.ts > paper/analysis/insertions.json
INS = INSJ['onlyThisEngine']
rows = []
for e in E7:
    n = O['names'][e]
    g = IV['namesChecked'][e]['gap']
    assert abs(g['value'] - 100*(n['otherHit']/n['otherRef']-n['properHit']/n['properRef'])) < 0.06
    rows.append(f"{SHORT[e]} & {100*n['properHit']/n['properRef']:.1f} & {100*n['otherHit']/n['otherRef']:.1f} & {g['value']:.1f} & [{g['ci'][0]:.1f}, {g['ci'][1]:.1f}] \\\\")
open('paper/tables/f_names.tex', 'w').write('\n'.join(rows) + '\n')

# Code-switching failure modes (English + X)
CEf = ['whisper-self-hosted', 'qwen', 'meta', 'gemini', 'gemini-smart', 'deepgram', 'assemblyai-3-6-pro', 'assemblyai-3-5-pro', 'zoom-scribe', 'elevenlabs-scribe', 'elevenlabs-scribe-clean', 'openai-live-transcribe-low', 'openai-realtime-whisper']
rows = []
for st, sn in [('both', 'Both selected'), ('en', 'English only'), ('auto', 'Auto-detect')]:
    for e in CEf:
        c = O[f'cs-all:english:{st}'][e]
        n = c['n']
        rows.append(f"{sn if e==CEf[0] else ''} & {SHORT[e]} & {pc(c.get('otherLost',0), n)} & {pc(c.get('firstLost',0), n)} & {pc(c.get('secondLost',0), n)} & {pc(c.get('missing',0), n)} & {pc(c.get('replaced',0), n)} & {pc(c.get('romanised',0), c['nonLatinN'])} & {pc(c.get('translatedToEnglish',0), c['nonLatinN'])} \\\\")
    rows[-1] += '[3pt]'
open('paper/tables/f_cs.tex', 'w').write('\n'.join(rows) + '\n')

# Where each engine's worst clips come from (clips at 50%+ error, language sets)
SETS = ['ar-sa', 'ar-ae', 'hi-in', 'ur-pk']
rows = []
for e in E7:
    w = O['worstBySet'].get(e, {})
    other = sum(v for k, v in w.items() if k not in SETS and not k.startswith('en-'))
    rows.append(f"{SHORT[e]} & " + ' & '.join(pc(w.get(s, 0), 20) for s in SETS) + f" & {pc(other, 140)} & {pc(O['tails:languages'][e].get('ge50',0), 220)} \\\\")
open('paper/tables/f_worst.tex', 'w').write('\n'.join(rows) + '\n')
json.dump({'hardAll': F['hardAllBySet'], 'solo': F['soloHard'], 'numref': NUMREF}, open('paper/tables/f_meta.json', 'w'))
print('hard for all', F['hardAllBySet'], 'solo', F['soloHard'], 'numrefs', NUMREF)

# What the errors are made of: wrong, missing and extra words per condition (% of words)
LANGS10 = ['ar-eg', 'ar-sa', 'ar-ae', 'de-de', 'es-419', 'es-es', 'es-pr', 'fr-fr', 'hi-in', 'zh-cn']  # Urdu left out: its errors are mostly the wrong alphabet
def mixof(e, sets):
    t = {k: sum(O[f'mix:set:{s}'][e].get(k, 0) for s in sets) for k in ['sub', 'del', 'ins', 'ref']}
    return [100 * t[k] / t['ref'] for k in ['sub', 'del', 'ins']]
rows = []
for e in E7:
    cells = mixof(e, ['en-dictation']) + mixof(e, ['en-dictation-noise']) + mixof(e, LANGS10)
    rows.append(f"{SHORT[e]} & " + ' & '.join(f'{v:.1f}' for v in cells) + r' \\')
open('paper/tables/f_mix.tex', 'w').write('\n'.join(rows) + '\n')
# Whispered English split into wrong, missing and extra words, for the figure (paper/make_figures.py)
json.dump([[SHORT[e], 100 * off[f'en-dictation-whisper/{e}']['headline']['value']] + mixof(e, ['en-dictation-whisper']) for e in E7], open('paper/analysis/whispermix.json', 'w'), indent=1)

# What the wrong English words are (all three English conditions together)
rows = []
for e in E7:
    k = {x: sum(O[f'subkind:{s}'][e].get(x, 0) for s in ['en-dictation', 'en-dictation-noise', 'en-dictation-whisper']) for x in ['number', 'name', 'close', 'other']}
    n = sum(k.values()); ref = sum(O[f'mix:set:{s}'][e]['ref'] for s in ['en-dictation', 'en-dictation-noise', 'en-dictation-whisper'])
    rows.append(f"{SHORT[e]} & {100*n/ref:.1f} & " + ' & '.join(pc(k[x], n) for x in ['number', 'name', 'close', 'other']) + r' \\')
open('paper/tables/f_subkind.tex', 'w').write('\n'.join(rows) + '\n')

# Whisper guide: every way we ran Whisper, side by side
FAM = [('whisper', 'Gated V3, VAD on', fam), ('whisper', 'Gated V3, VAD off', fam_off), ('whisper-self-hosted', 'Self-hosted, VAD cuts', off),
       ('whisper-self-hosted-vad', 'Self-hosted, VAD drops', fam),
       ('whisper-self-hosted-ten', 'Self-hosted, TEN cuts', fam), ('whisper-self-hosted-ten-vad', 'Self-hosted, TEN drops', fam),
       ('openai-realtime-whisper', 'OpenAI Realtime Whisper', off),
       ('openai-whisper-1', 'Whisper-1', fam), ('openai-whisper-1-split', 'Whisper-1 split', fam)]
TWO = {'Gated V3, VAD on': 'Gated|VAD on', 'Gated V3, VAD off': 'Gated|VAD off', 'Self-hosted, VAD cuts': 'Self-hosted|Silero cuts', 'Self-hosted, VAD drops': 'Self-hosted|Silero drops',
       'Self-hosted, TEN cuts': 'Self-hosted|TEN cuts', 'Self-hosted, TEN drops': 'Self-hosted|TEN drops',
       'OpenAI Realtime Whisper': 'OpenAI|RT Whisper', 'Whisper-1': 'OpenAI|Whisper-1', 'Whisper-1 split': 'Whisper-1|split'}
open('paper/tables/fam_header.tex', 'w').write(' & '.join(r'\shortstack[r]{%s}' % TWO[n].replace('|', r'\\') for _, n, _ in FAM))
def famrow(label, vals, fmt=lambda v: f'{v:.1f}', lower=True):
    ok = [v for v in vals if v is not None]; m = min(ok) if lower else max(ok)
    return label + ' & ' + ' & '.join('--' if v is None else (r'\textbf{%s}' % fmt(v) if v == m else fmt(v)) for v in vals) + r' \\'
rows = []
for s_, name in [('en-dictation', 'English, quiet'), ('en-dictation-noise', 'English, fan on'), ('en-dictation-whisper', 'English, whispered')]:
    rows.append(famrow(name, [100 * A[f'{s_}/{e}']['headline']['value'] for e, _, A in FAM]))
rows.append(famrow('10 other languages$^\\dagger$', [100 * sum(A[f'{s_}/{e}']['headline']['value'] for s_ in langs) / len(langs) for e, _, A in FAM]))
for s_, name in [('hi-in', 'Hindi'), ('es-es', 'Spanish (Spain)')]:
    rows.append(famrow(name, [100 * A[f'{s_}/{e}']['headline']['value'] for e, _, A in FAM]))
rows.append(famrow('English, quiet, formatted', [100 * A[f'en-dictation/{e}']['formatted'] for e, _, A in FAM]))
rows.append(r'\midrule')
rows.append(famrow('Wait, median (ms)', [A[f'latency/{e}']['waitP50'] for e, _, A in FAM], fmt=lambda v: f'{v:,}'))
rows.append(famrow('Wait, 90th percentile (ms)', [A[f'latency/{e}']['waitP90'] for e, _, A in FAM], fmt=lambda v: f'{v:,}'))
rows.append(famrow('No-speech clips with text (of 10)', [round(10 * A[f'nonspeech/{e}']['nonSpeechOutputRate']) for e, _, A in FAM], fmt=lambda v: f'{v}'))
rows.append(r'\midrule')
import csv as _csv
CSFAM = {}
for r in _csv.DictReader(open('cache/clips/2026-10-21-codeswitch.tsv'), delimiter='\t'):  # every recording, as in the main two-language table
    a = CSFAM.setdefault(f"{r['kind']}/{r['setting']}/{r['engine']}", [0, 0])
    a[0] += r['first_verdict'] in ('missing', 'replaced') or r['second_verdict'] in ('missing', 'replaced'); a[1] += 1
def csv_(k, e, A):
    if A is fam_off: return None  # gated Whisper ran the two-language test with its VAD only
    a = CSFAM.get(f'{k}/{e}');  return None if not a else round(100 * a[0] / a[1])
rows.append(famrow('Lost a language, EN\\,+\\,X (\\%)', [csv_('english/both', e, A) for e, _, A in FAM], fmt=lambda v: f'{v}'))
rows.append(famrow('Lost a language, X\\,+\\,Y (\\%)', [csv_('pair/both', e, A) for e, _, A in FAM], fmt=lambda v: f'{v}'))
open('paper/tables/f_family.tex', 'w').write('\n'.join(rows) + '\n')
print('family fair', csf['english/both/whisper']['fair'], csf['pair/both/whisper']['fair'])

# Typeset negative numbers with a real minus sign and drop negative zero, in every generated table (not the figures).
# Idempotent, so it also covers the tables written by paper/analysis/external.py and ears_vad.py.
import glob, re
for f in glob.glob('paper/tables/*.tex'):
    if os.path.basename(f).startswith('fig_'):
        continue
    t = open(f).read()
    u = re.sub(r'(?<![\w$-])-0\.0(?!\d)', '0.0', t)
    u = re.sub(r'(?<![\w$-])-(?=\d)', '$-$', u)
    if u != t:
        open(f, 'w').write(u)
