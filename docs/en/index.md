<img class="ct-mark" src="assets/img/ctp-mark-beat.svg" alt="Common Time Protocol — CTP" width="160" height="160">

# A protocol for making independent clients agree on musical time

No audio crosses the wire. One anchor does, and after that only integer ticks
and commands placed on them. Every client already holds the material; the
protocol decides *when*.

<div data-readout
     data-label-region="Session readout"
     data-label-tick="Session tick"
     data-label-bar="Bar"
     data-label-beat="Beat"
     data-label-meter="Meter"
     data-formula-name="tick"></div>

This page derives its own tick from a fixed anchor — *13 September 2026, 00:00
UTC* — using integer arithmetic and floored division, exactly as a client must
(N14). It is what a client does, minus the audio. The ceiling is
9 007 199 254 740 991: a tick must fit in 53 bits, because JSON numbers are
floating point (N12). At 118 BPM that is roughly 151 000 years.

## Where to start

| | |
| --- | --- |
| [§1 · What crosses the wire](spec/crossing.md) | What the protocol carries, and what it never does |
| [§2 · Anchor and ticks](spec/time.md) | One anchor, immutable tempo, integer time |
| [§4 · Messages](spec/messages.md) | Ten messages, five operations |
| [§6 · Obligations](spec/obligations.md) | What an implementation must achieve |
| [Status](status.md) | What is measured and what is not |
| [The ask](contribute.md) | Why a third implementation is worth the most |
| [Documents](documents.md) | The specification and everything around it |

!!! warning "This page is not normative"
    Where it differs from the specification, the specification wins; where the
    language versions differ, English wins. No acronym: the unambiguous token
    is `commontime`, lower case.

    Nothing on this page is connected to anything. The tick above is this
    page's own arithmetic.
