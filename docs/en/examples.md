# Examples

The specification says what is true. This page shows what that looks like in
numbers.

Every figure below is computed with the same arithmetic the page's own tick
readout uses — integers, floored division. You can check them yourself.

## The same loop, at different tempi

This is what a fractional bar position does not give. Loop length **in ticks**
does not depend on tempo at all; only its duration in seconds does.

| Tempo | 16 bars in ticks | Duration |
| --- | --- | --- |
| 100 BPM | 61 440 | 38.4000 s |
| 118 BPM | 61 440 | 32.5424 s |
| 120 BPM | 61 440 | 32.0000 s |
| 140 BPM | 61 440 | 27.4286 s |

`61 440` is exactly `16 × ppq × beatsPerBar` = `16 × 960 × 4`. It is an
integer at every tempo, in every implementation, with no rounding — which is
why two loops can be checked for equality by comparing two integers.

## From a bar to a tick

The session is in 4/4 and `ppq` is 960, so one bar is
`ticksPerBar = 960 × 4 = 3 840` ticks.

```
bar 25, beat 1   =  25 × 3 840  =  96 000 ticks
```

With the anchor at **13 September 2026, 00:00:00 UTC** and a tempo of 118 BPM,
tick 96 000 falls at **00:00:50.847 UTC**. A client never receives that wall
clock time over the wire: it receives the tick `96000` and derives the instant
from the anchor itself.

## N14 in practice

A tick may be negative, because a session may be announced before its anchor.
Three instants before the anchor:

| Instant | Tick | Bar / beat | Truncating division would give |
| --- | --- | --- | --- |
| anchor − 1 ms | **−2** | −1 / 4 | −1 &nbsp;✗ |
| anchor − 500 ms | −944 | −1 / 4 | −944 |
| anchor − 60 000 ms | −113 280 | −30 / 3 | −113 280 |

The first row is the whole of N14 in a single number. One millisecond before
the anchor the correct tick is **−2**, but JavaScript's `/` — and the native
operator of most other languages — truncates toward zero and gives **−1**. Two
implementations, one truncating and one flooring, diverge by one tick at the
first negative value, and neither notices anything.

The other two rows reveal nothing: their remainder happens to be zero, so
truncation and flooring agree. Which is why the bug does **not** show up in a
test that tries round numbers.

See [§2 · Anchor and ticks](spec/time.md) for how to write the calculation
correctly.
