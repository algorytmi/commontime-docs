# Common Time — documentation

This repository builds the public site for the **Common Time** protocol. The
complete source material — the handover package, the findings register and the
decision record — is **not in this repository**. It is kept alongside it, in
`../common-time-private/`, and the README there says why. Read its `HANDOVER.md`
first and `REGISTER.md` second.

## The name

The protocol is **Common Time**. The unambiguous token is `commontime`, lower
case. **There is no acronym.** "CTP" is one of the four recorded refusals in the
rationale — it is taken several times over in this field (Common Timing
Protocol, Common Transport Protocol, Cloud Tunneling Protocol) — and it must not
appear in normative text or on the site. It survives only in file names and in
this agent's working name.

## What this repository owns, and what it does not

This repository owns **the site and the currency of the documentation**. It does
not own the implementations (implementer A, implementer B) and it does not own
decisions. **H-items are approved by Juho, never here.**

## Rules that are not style preferences

Each of these exists because breaking it has already cost something.

1. **One pen on the specification.** Record a finding; never fix the text.
2. **Never resolve a gap silently.** An unclear, contradictory or missing
   passage is recorded and worked around. A silent resolution is exactly how two
   implementations drift apart while both look correct.
3. **Never extend the protocol.** Ten messages, five operations, one extension
   point (`param`), zero optional features.
4. **A finding needs two readings.** Without two plausible interpretations that
   lead to different implementations it is a question, not a finding.
5. **H-numbers are assigned by the specification.** Implementers propose under
   their own identifiers (`F14`, `F-B2`). Collisions have happened twice; see
   the register, §4.
6. **Cite the versioned clause.** "§2 / commontime/1", never "§2".
7. **A change log line in every document, every time.** It says *what* changed.
   Reasoning belongs in the rationale, never in normative text.
8. **Never claim blocking before it is measured.** "Consequence if they differ"
   is readable from the text; "whether they differ" is only runnable. Divergence
   is predicted by the number of natural readings, not by the size of the
   consequence.
9. **Measure from the tape, not from the log.** A clock cannot be proved with
   itself. Any accuracy claim not backed by a cross-correlated recording is a
   calibration and must be labelled as one.

## The mark

The mark's own documentation (`brand/common-time-merkki.html` in the private
material) is the authority. The sizes are measured: the full mark holds to 48 px, muddies at 32, is unreadable at 16.

- **≥ 48 px** — full mark, `shared/img/ctp-symbol.svg` (13 rings).
- **32–47 px** — culled variant, `shared/img/ctp-symbol-small.svg` (6 rings).
- **< 32 px** — needs a separately drawn mark. It does not exist; it awaits the
  author's decision. The favicon is knowingly below this floor.

The faint second path is an **afterimage**, not a construction drawing: the same
path at the same coordinates, visible only because the shape on top scales
during the beat. Do not "simplify" it away.

The beat is 4 beats to the bar at **118 BPM** — the specification's own vector
tempo — so one bar is `4 × 60000 / 118 = 2033.898 ms`, not 2000. It is
phase-locked from the shared anchor in `shared/js/mark.js`; the animation is
added by script rather than by the stylesheet, so a page without scripting shows
a still mark instead of an unsynchronised one. An `<img>`-embedded mark cannot
be locked and must therefore be static.

## Building

```bash
./build.sh            # both languages, --strict, into site/fi and site/en
systemctl restart common-time-docs   # only needed if serve.py itself changed
```

Two configs rather than one: mkdocs-shadcn has no content i18n. `build.sh` also
compiles `locales/fi` into the theme package and rewrites `<html lang>`, which
the theme hardcodes to `en`.

Live figures on the site must be derived with `BigInt` and **floored division**
(N14), never floating point. `shared/js/readout.js` is the model.
