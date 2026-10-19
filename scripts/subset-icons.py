"""Retain the original Material Icons outlines with only the needed ligatures.

Optional maintainer tool, not a CI/build requirement. Requires fontTools.
Update src/assets/fonts/material-icons-round.json before adding a new icon,
then run: python3 scripts/subset-icons.py
"""
import json
from pathlib import Path
from fontTools import subset
from fontTools.ttLib import TTFont

root = Path(__file__).resolve().parent.parent
directory = root / 'src/assets/fonts'
names = json.loads((directory / 'material-icons-round.json').read_text())['icons']
font = TTFont(root / 'node_modules/material-icons/iconfont/material-icons-round.woff')
assert set(names).issubset(font.getGlyphOrder()), 'Unknown Material Icons glyph'
options = subset.Options()
options.layout_closure = False
options.glyph_names = True
subsetter = subset.Subsetter(options)
subsetter.populate(glyphs=names, text=''.join(names))
subsetter.subset(font)
font.flavor = 'woff'
font.save(directory / 'material-icons-round.woff')
print(f'Saved {len(names)} original icons without changing their outlines or metrics.')
