# commontime-docs

The source of **[common-time.dev](https://common-time.dev)** — the public
documentation site for the Common Time protocol, in Finnish and English.

Common Time is a network protocol that makes independent clients agree on
musical time. No audio crosses the wire: one anchor does, and after that only
integer ticks and the commands placed on them. Every client already holds the
material; the protocol decides *when*.

The unambiguous token is `commontime`, lower case. **There is no acronym** —
that is a recorded decision, not an oversight.

This site is not the specification. Where it differs from the normative text,
the normative text wins.

## Building

```bash
python3 -m venv venv && venv/bin/pip install -r requirements.txt
./build.sh            # both languages, --strict, into site/fi and site/en
python3 serve.py      # serves the build on 127.0.0.1:3100, / -> /en/
```

`build.sh` does three things beyond calling mkdocs twice: it copies `shared/`
into each language's `assets/`, compiles `locales/fi` into the theme package,
and rewrites `<html lang>`, which the theme hardcodes to `en`.

## Why two builds

The theme, [mkdocs-shadcn](https://github.com/asiffer/mkdocs-shadcn), has no
content i18n — its own i18n is gettext for the theme's interface strings, and it
ships French and Portuguese only. So each language is its own `docs_dir` and its
own `site_dir`, joined by a language link in the top bar, and the Finnish
interface catalogue lives here in `locales/`.

Three small overrides sit in `overrides/`, each for a reason recorded in the
file: the language link (a top-level external nav entry renders as a section
heading with no anchor), the footer, and the head hook that carries the
language-link configuration.

## Layout

```
docs/fi, docs/en    the two builds' content
shared/             one copy of the JS, CSS and mark assets, copied into both
locales/fi          the Finnish interface catalogue the theme does not ship
overrides/          three theme template overrides
mkdocs.fi.yml       one config per language
build.sh            builds both
serve.py            static server for the built output, stdlib only
CLAUDE.md           the rules this repository works under
```

Live figures on the site — the tick readout, the worked examples — are derived
with `BigInt` and floored division, never floating point. That is a normative
requirement of the protocol, and the site keeps to it rather than describing it.

## What is not here

The handover package, the findings register and the decision record are kept
outside this repository on purpose. The project's division of labour says the
second implementer reads the specification and the conformance suite and nothing
else, because a reader who sees the resolutions written out in prose implements
the interpretation rather than the text — and the cross-run between two
independent implementations is the only test that says whether this is a
protocol or a library.

## Licence

MIT — see `LICENSE`. This covers everything in the repository, the mark's
geometry included.

The theme is mkdocs-shadcn by [@asiffer](https://github.com/asiffer), also MIT.
Its full notice is on the site's colophon.
