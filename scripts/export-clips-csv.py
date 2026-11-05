"""Exports every model's input and output, clip by clip, into one tagged CSV.

    python3 scripts/export-clips-csv.py --out <path outside the repo>

Contains the private reference texts and transcripts, so it must never be committed
or published. Written as UTF-8 with a BOM so spreadsheet apps show Arabic, Hindi,
Urdu and Chinese correctly.
"""
import csv, json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = lambda *a: os.path.join(ROOT, *a)
csv.field_size_limit(10**9)
read = lambda p: list(csv.DictReader(open(P(p), encoding='utf-8'), delimiter='\t'))
out = sys.argv[sys.argv.index('--out') + 1]
if os.path.commonpath([os.path.abspath(out), ROOT]) == ROOT and '/cache/' not in os.path.abspath(out):
    sys.exit('Refusing to write private transcripts inside the repo; choose a path outside it (or under cache/).')

manifest = {r['id']: r for r in read('data/manifest.tsv')}
main = json.load(open(P('results/2026-10-15-all-engines/results.json')))
zoom = {'labels': {}, 'models': {}, 'aggregates': {}}
LABEL = {**main['labels'], **zoom['labels']}
MODEL = {**main['models'], **zoom['models']}
MODEL = {e: ('self-hosted streaming deployment' if str(m).startswith(('baseten:', 'self-hosted')) else m) for e, m in MODEL.items()}
UNSUP = {k for k, v in {**main['aggregates'], **zoom['aggregates']}.items() if isinstance(v, dict) and v.get('languageNotSupported')}

DATASET = {'en-dictation': 'In-house dictation', 'en-dictation-noise': 'In-house dictation', 'en-dictation-whisper': 'In-house dictation',
           'nonspeech': 'generated non-speech', 'ar-eg': 'FLEURS', 'ar-sa': 'SADA', 'ar-ae': 'Casablanca', 'de-de': 'FLEURS', 'es-419': 'FLEURS',
           'es-es': 'VoxPopuli', 'es-pr': 'OpenSLR', 'fr-fr': 'FLEURS', 'hi-in': 'FLEURS', 'ur-pk': 'FLEURS', 'zh-cn': 'FLEURS'}
VARIETY = {'ar-eg': 'Egyptian', 'ar-sa': 'Najdi (Saudi)', 'ar-ae': 'Emirati', 'es-419': 'Latin American', 'es-es': 'Spain', 'es-pr': 'Puerto Rico',
           'de-de': 'Germany', 'fr-fr': 'France', 'hi-in': 'India', 'ur-pk': 'Pakistan', 'zh-cn': 'Mainland China (Mandarin)', 'en-dictation': 'US/International English'}
CONDITION = {'en-dictation': 'clean', 'en-dictation-noise': 'noisy', 'en-dictation-whisper': 'whispered', 'nonspeech': 'non-speech (silence / noise)'}
ZOOM_LOCALE = {'ar-eg': 'sent as ar-SA (no Egyptian locale)', 'es-419': 'sent as es-ES (no Latin American locale)', 'es-pr': 'sent as es-ES (no Puerto Rico locale)'}
GATED = {'whisper'}  # the client VAD sits in front of gated Whisper only
# Setting rows: same model as their parent, run with a clean-up option.
SETTING_NOTE = {'gemini-smart': 'Gemini 3.5 Transcribe in Smart mode (fillers and false starts removed, spoken corrections applied, lists/numbers/dates formatted)',
                'elevenlabs-scribe-clean': 'ElevenLabs Scribe v2 Realtime with no_verbatim (fillers and false starts removed); text finalized once when the audio ends, as the default'}

COLS = ['benchmark', 'clip_id', 'audio_file', 'audio_seconds', 'dataset', 'test_set', 'condition', 'language', 'language_variety',
        'language_setting', 'model', 'model_label', 'model_version', 'voice_check', 'chunk_ms',
        'reference', 'transcript', 'errors', 'reference_words', 'error_rate_pct', 'unit', 'wait_after_speech_ms', 'outcome',
        'first_language', 'first_reference', 'first_result', 'second_language', 'second_reference', 'second_result', 'counted_in_fair_set', 'notes']
CHUNK = {'meta': '32 (24 kHz)', 'assemblyai-3-6-pro': '100', 'assemblyai-3-5-pro': '100', 'zoom-scribe': '100', 'elevenlabs-scribe': '32 (base64 JSON)', 'elevenlabs-scribe-clean': '32 (base64 JSON)'}
rows = []

def single(path, vad):
    for r in read(path):
        e, s, m = r['engine'], r['set'], manifest.get(r['clip'], {})
        lang = m.get('language', '')
        unsup = f'{s}/{e}' in UNSUP
        errs, n = r['errors'], r['ref_tokens']
        rate = f'{100 * int(errs) / int(n):.1f}' if errs and n and int(n) else ''
        err = r.get('error') or ''
        # On non-speech, a timeout with no text means the engine (correctly) never produced a transcript.
        if s == 'nonspeech' and err.startswith('timeout') and not r['transcript'].strip(): err = ''
        outcome = ('dropped before the engine (voice check)' if err.startswith('dropped') else f'failed: {err}' if err
                   else ('no text (correct)' if not r['transcript'].strip() else 'text returned on non-speech') if s == 'nonspeech'
                   else 'empty transcript' if not r['transcript'].strip() else 'transcribed')
        notes = []
        if unsup: notes.append('engine has no option for this language; no language was sent')
        if e == 'zoom-scribe' and s in ZOOM_LOCALE: notes.append(ZOOM_LOCALE[s])
        if e in SETTING_NOTE: notes.append(SETTING_NOTE[e])
        rows.append(dict(benchmark='single-language', clip_id=r['clip'], audio_file=m.get('file', ''), audio_seconds=m.get('duration_sec', ''),
            dataset=DATASET.get(s, ''), test_set=s, condition=CONDITION.get(s, 'clean'), language=lang, language_variety=VARIETY.get(s, ''),
            language_setting='auto-detect (no option for this language)' if unsup else ('none (non-speech)' if s == 'nonspeech' else f'specified: {lang}'),
            model=e, model_label=LABEL.get(e, e), model_version=MODEL.get(e, ''), voice_check=vad if e in GATED else 'n/a (not used for this model)',
            chunk_ms=CHUNK.get(e, '32'), reference=r['reference'], transcript=r['transcript'], errors=errs, reference_words=n, error_rate_pct=rate,
            unit='MER (characters)' if lang == 'zh' else 'WER (words)', wait_after_speech_ms=r['latency_ms'], outcome=outcome, notes='; '.join(notes)))

# Whisper appears twice: with the client VAD (gated) and without it.
# Qwen's rows in the main run are already without a voice check.
single('cache/clips/2026-10-15-all-engines.tsv', 'on')
single('cache/clips/2026-10-13-whisper-no-vad.tsv', 'off')

SETTING = {'both': 'both languages selected', 'en': 'English only', 'auto': 'auto-detect'}
mixes = {m['id']: m for m in read('data/codeswitch/mixes.tsv')}
for r in read('cache/clips/2026-10-15-codeswitch.tsv'):
    e, m = r['engine'], mixes.get(r['recording'], {})
    langs = f"{r['first_language']}+{r['second_language']}"
    rows.append(dict(benchmark='two-language', clip_id=r['recording'], audio_file='codeswitch/' + m.get('file', ''), audio_seconds=m.get('duration_sec', ''),
        dataset='built from ' + ' + '.join(DATASET.get(m.get(k, ''), '') for k in ['first_set', 'second_set']),
        test_set='english+other' if r['kind'] == 'english' else 'two non-english', condition='two languages, 300 ms pause',
        language=langs, language_variety=' + '.join(VARIETY.get(m.get(k, ''), '') for k in ['first_set', 'second_set']),
        language_setting=SETTING[r['setting']] + (f' ({langs})' if r['setting'] == 'both' else ''),
        model=e, model_label=LABEL.get(e, e), model_version=MODEL.get(e, ''), voice_check='on' if e in GATED else 'n/a (not used for this model)',
        chunk_ms=CHUNK.get(e, '32'), reference=r['first_reference'] + ' || ' + r['second_reference'], transcript=r['transcript'],
        outcome='a language was lost' if 'missing' in (r['first_verdict'], r['second_verdict']) or 'replaced' in (r['first_verdict'], r['second_verdict']) else 'both languages present',
        first_language=r['first_language'], first_reference=r['first_reference'], first_result=r['first_verdict'],
        second_language=r['second_language'], second_reference=r['second_reference'], second_result=r['second_verdict'],
        counted_in_fair_set=r['counted'], notes='; '.join(x for x in ['lost = under 20% of that half\'s words present; replaced = other text in its place (e.g. a translation)', SETTING_NOTE.get(e, '')] if x)))

with open(out, 'w', newline='', encoding='utf-8-sig') as f:
    w = csv.DictWriter(f, fieldnames=COLS)
    w.writeheader()
    w.writerows(rows)
print(f'{len(rows)} rows -> {out}')
