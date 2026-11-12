"""Writes a single self-contained .tex for Overleaf: tables, figures and the bibliography inlined.

  python3 paper/make_overleaf.py <main.bbl> <out.tex>

<main.bbl> comes from compiling paper/main.tex with intermediates kept
(tectonic -X compile paper/main.tex --keep-intermediates --outdir <dir>). The figures are pgfplots code in
paper/tables/fig_*.tex, so the output needs no image files.
"""
import re, sys

bbl, out = sys.argv[1], sys.argv[2]
s = open('paper/main.tex').read()
s = re.sub(r'\\tabinput (tables/[\w_]+\.tex)', lambda m: open('paper/' + m.group(1)).read().rstrip('\n'), s)
s = re.sub(r'\\bibliographystyle\{[^}]*\}\n', '', s)
s = re.sub(r'\\bibliography\{refs\}', lambda m: open(bbl).read().rstrip('\n'), s)
s = s.replace('% \\input inside a tabular breaks booktabs rules; the primitive does not.\n', '')
s = s.replace('\\makeatletter\\let\\tabinput\\@@input\\makeatother\n', '')
assert 'tabinput' not in s and 'includegraphics' not in s
open(out, 'w').write(s)
print('wrote', out)
