"""Writes the paper's figures as pgfplots code in paper/tables/fig_*.tex, so the single-file Overleaf export needs no
image files. Run after paper/make_tables.py (and paper/analysis/vadsweep.py for the sweep figure).

  python3 paper/make_figures.py

Colours: categorical slots 1-3 of the dataviz reference palette (blue, orange, aqua), checked for colour-blind
separation; every bar also carries its value, so no reading depends on colour alone.
"""
import json, os, re


def rows(path):
    """Rows of a generated LaTeX table body: [label, numbers...]."""
    out = []
    for line in open(path):
        cells = [re.sub(r'\\textbf\{([^}]*)\}', r'\1', c).strip().rstrip('\\').strip() for c in line.split('&')]
        if len(cells) > 1:
            out.append([cells[0]] + [float(re.sub(r'[^\d.]', '', c) or 'nan') for c in cells[1:]])
    return out


# Whispered WER split into wrong, missing and extra words (paper/analysis/whispermix.json, from make_tables.py:
# label, WER, wrong, missing, extra).
data = sorted(([r[0], r[1]] + [round(v, 1) for v in r[2:]] for r in json.load(open('paper/analysis/whispermix.json'))), key=lambda r: r[1])
names = [r[0] for r in data]
coords = lambda col: ' '.join(f'({r[col]},{{{r[0]}}})' for r in data)
labels = '\n'.join(f'\\node[anchor=west, font=\\scriptsize, text=black!65] at (axis cs:{r[2] + r[3] + r[4]},{{{r[0]}}}) {{{r[1]:.1f}}};' for r in data)
fig = r"""\begin{tikzpicture}
\begin{axis}[xbar stacked, width=0.92\textwidth, height=7cm, bar width=8pt, xmin=0, xmax=52,
  symbolic y coords={%s}, ytick=data, y dir=reverse, yticklabel style={font=\footnotesize},
  xlabel={Share of words (\%%), whispered English}, xlabel style={font=\footnotesize}, xticklabel style={font=\footnotesize},
  axis y line*=left, axis x line*=bottom, xmajorgrids, major grid style={black!12},
  legend style={draw=none, font=\footnotesize, legend columns=3, at={(0.98,0.98)}, anchor=north east}, legend cell align=left]
\addplot[fill=figblue, draw=white] coordinates {%s};
\addplot[fill=figorange, draw=white] coordinates {%s};
\addplot[fill=figaqua, draw=white] coordinates {%s};
\legend{Wrong, Missing, Extra}
%s
\end{axis}
\end{tikzpicture}
""" % (','.join(names), coords(2), coords(3), coords(4), labels)
open('paper/tables/fig_whispermix.tex', 'w').write(fig)
print('wrote paper/tables/fig_whispermix.tex')

# VAD threshold sweep: three small panels sharing the threshold axis (no dual axis).
SWEEP = 'paper/analysis/vadsweep.json'
if os.path.exists(SWEEP):
    S = json.load(open(SWEEP))
    th = S['thresholds']
    pts = lambda vals: ' '.join(f'({t},{v})' for t, v in zip(th, vals))
    panel = lambda key, title, ymax, xshift: r"""\begin{axis}[at={(%scm,0)}, width=5.4cm, height=4.6cm, title={%s}, title style={font=\footnotesize, align=center},
  xtick={0.2,0.3,0.4,0.5}, xlabel={Threshold}, xlabel style={font=\footnotesize}, ticklabel style={font=\scriptsize}, ymin=0, ymax=%s,
  axis x line*=bottom, axis y line*=left, ymajorgrids, major grid style={black!12}%s]
\addplot[figblue, line width=1.4pt, mark=*, mark size=1.8pt] coordinates {%s};
\addplot[figorange, line width=1.4pt, mark=square*, mark size=1.8pt] coordinates {%s};
%s\end{axis}
""" % (xshift, title, ymax, ', legend style={draw=none, fill=none, font=\\scriptsize, at={(0.97,0.52)}, anchor=east}' if key == 'whisperWer' else '',
       pts(S[key]['silero']), pts(S[key]['ten']), '\\legend{Silero, TEN}\n' if key == 'whisperWer' else '')
    fig = '\\begin{tikzpicture}\n' + panel('whisperWer', 'Whispered WER (\\%)', 60, 0) + panel('speechShare', 'Whispered audio\\\\called speech (\\%)', 100, 5.3) \
        + panel('silenceText', 'No-speech clips\\\\with text (of 10)', 10, 10.6) + '\\end{tikzpicture}\n'
    open('paper/tables/fig_vadsweep.tex', 'w').write(fig)
    print('wrote paper/tables/fig_vadsweep.tex')
