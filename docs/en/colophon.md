# About this site

This site is not the specification. The normative text is its own document and
wins over this site in case of conflict — see [Documents](documents.md).

## Theme

The site uses the **[mkdocs-shadcn](https://github.com/asiffer/mkdocs-shadcn)**
theme by **[@asiffer](https://github.com/asiffer)**. The theme is MIT licensed:

> MIT License · Copyright (c) 2026 asiffer

The licence asks for the notice to travel with the code, not to be printed on
every page. So it is here and in the licence file rather than in every page's
footer.

Three changes have been made to the theme, all under `overrides/`: the language
switch (the theme renders a top-level external nav entry as a section heading
with no link), this footer, and a Finnish message catalogue — the theme ships
only French and Portuguese.

## Fonts

The theme brings its own: **Geist**, **Geist Mono** and **Inter**. The site
loads fonts from nowhere else.

## The mark

The Common Time mark is **13 rings and 92 vertices**, one path with
`fill-rule="evenodd"`. The top bar carries a culled six-ring variant, because
the full mark was measured muddy at 32 px and unreadable at 16.

It receives four impulses to the bar at **118 BPM** — the specification's own
vector tempo — so one bar is `4 × 60000 / 118 = 2033.898` milliseconds. The
phase is derived from the shared anchor, because without it every reader's mark
would beat in its own phase, which on a site about getting independent clients
onto one time would be its own joke.

Geometry and rhythm are identity, not protocol. The specification says nothing
about the mark.

## The live tick

The readout on the front page derives its own tick from a fixed anchor, with the
same arithmetic a client must use: integers (`BigInt`) and **floored division**,
never floating point. N1 is not a formality, and the page keeps to it itself.

`prefers-reduced-motion` stops both the readout and the mark.

## Search

The search index is lunr, and the Finnish build uses Finnish stemming. Each
language is indexed separately, because the site is built twice — one build per
language.
