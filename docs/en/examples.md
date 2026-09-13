# Examples

The specification says what is true. This page shows what that looks like, in
numbers and in messages.

!!! note "What on this page is normative"
    Some of these are quoted directly from the normative text (*Common Time
    Core*, commontime/1, version 1.2a) and are marked as such. The rest are
    **implementation examples**: they show what one existing implementation
    does, not what the protocol requires. Where they differ, the specification
    wins.

## The accepted vector

**Normative, §7.** This is the specification's own test vector, chosen under N5
so that an incorrect implementation produces a visibly incorrect answer.

```
ping     t0 = 1789232400000
pong     t1 = 1789232401000        response received at 1789232400200
         → offset = t1 − (t0 + rtt/2) = +900 ms

session  anchor = 1789232400000, bpm = 118, beatsPerBar = 4, ppq = 960

local clock  1789232460000
         serverNow = 1789232460900    elapsed = 60900
         tick = 60900 × 118 × 960 / 60000 = 114,979
```

An uncorrected implementation — one that ignores the offset between clocks —
reads the same instant as **113,280**. The difference is **1,699 ticks**, about
0.9 seconds. That is a beat and a half late, and it is audible.

That is the point of the vector. §7 also records a rejected one: a 40 ms offset
at 118 BPM is two percent of a bar, so the corrected and uncorrected answers
round to the same number — and a faulty implementation passes.

## The five operations

**Normative, §4.** The `op` field of `ct.cmd` takes these five values. `param`
is the only extension point, and its namespace belongs to the application.

| `op` | What it does | `value` | `rampTicks` |
| --- | --- | --- | --- |
| `start` | slot begins playing its material | — | yes |
| `stop` | slot stops playing | — | yes |
| `gain` | slot level | decibels | yes |
| `param` | application-defined parameter | name + value | yes |
| `material` | assigns material to the slot | identifier | **no** |

`material` is an instantaneous assignment and takes no ramp. `rampTicks = 0`
means the local minimum: a client **must not** produce a discontinuity, but the
mechanism is unspecified. Greater than 0 means the value is reached over
`atTick → atTick + rampTicks`, linear in the parameter's declared unit (N7).

## A complete session

**Implementation example, not normative.** This flow was executed, not written:
it is the traffic one existing implementation produced over WebSocket (N11),
from the start to the first sound.

```json
client →   {"type":"ct.hello","v":"commontime/1"}
→ client   {"type":"ct.hello","v":"commontime/1"}
→ client   {"type":"ct.session","id":"kellari-2026-09-13","anchorEpochMs":1789313361186,
            "bpm":118,"beatsPerBar":4,"ppq":960}
client →   {"type":"ct.ping","t0":1789313361226}
→ client   {"type":"ct.pong","t0":1789313361226,"t1":1789313361227}
→ client   {"type":"ct.load","id":1,
            "material":"sha256:3f8a2b1c9d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8",
            "lengthTicks":15360}
client →   {"type":"ct.ready","ref":1,"readyAtTick":157}
→ client   {"type":"ct.cmd","id":1,"atTick":15360,"slot":0,"op":"material",
            "value":"sha256:3f8a…d7e8","rampTicks":0}
→ client   {"type":"ct.cmd","id":2,"atTick":15360,"slot":0,"op":"start",
            "value":null,"rampTicks":960}
→ client   {"type":"ct.cmd","id":3,"atTick":30720,"slot":0,"op":"gain",
            "value":-6,"rampTicks":3840}
```

Four things worth reading out of it:

**`ct.load` does not assign material to anything.** It is a content-addressed
fetch with no slot. Assignment is slot state and therefore a `ct.cmd` whose `op`
is `material` (H21, since version 1.1). A flow that goes from `ct.load` straight
to `start` leaves the slot empty, and V3 makes that silence.

**Commands are scheduled into the future.** `atTick` 15,360 is four bars, or
8.14 s from the anchor. That is the normal way to use the protocol, not a
special case.

**`readyAtTick` is the client's own estimate**, not an echo of the request (N3).
A client that cannot meet the request answers `ct.refuse`.

**`ct.cmd` is never answered** and never acknowledged (N3). A late command is
applied anyway, and the lateness is reported in the `late` list of `ct.state` as
`{ id, lateTicks }`.

## Two commands competing for one slot

**Normative rule (N8), the example illustrates it.** The highest `atTick` wins;
ties are broken by the higher `id`.

Slot 0 receives two `gain` commands, both at `atTick` 30,720. `id` 3 with value
−6 and a ramp of 3,840, `id` 4 with value −12 and no ramp. Same `atTick`, so the
higher `id` wins:

```json
{
  "type": "ct.snapshot",
  "atTick": 40000,
  "cmds": [
    {"id":1,"atTick":15360,"slot":0,"op":"material","value":"sha256:3f8a…d7e8","rampTicks":0},
    {"id":2,"atTick":15360,"slot":0,"op":"start","value":null,"rampTicks":960},
    {"id":4,"atTick":30720,"slot":0,"op":"gain","value":-12,"rampTicks":0}
  ]
}
```

Three things to point at:

- **The loser (`id` 3) is not there at all.** A snapshot is the set of winning
  commands, not a history.
- **The winner is the command entire, not a value.** The snapshot does not say
  "gain is now −12 dB". A snapshot **must not** carry evaluated values (N8).
- **The `start` command's own `atTick` of 15,360 survives**, and it is the whole
  reason a late-joining client plays the right point in the material. N10
  measures phase from the winning `start` command's `atTick` — and that number
  exists nowhere else but in that command.

The specification measured what its absence would cost: without it a late joiner
would be off by **6,976 ticks**, 3.7 seconds of an 8.1-second loop (H19).

## The sample-count check

**Normative, N4.** On `ct.load` a client must verify the material's sample count
against **the material's own sample rate**, not its own output rate:

```
samples = lengthTicks × 60 × sampleRate / (ppq × bpm)
```

For a four-bar loop (`lengthTicks` 15,360) in a 118 BPM session:

| Sample rate | Required sample count |
| --- | --- |
| 48,000 Hz | 390,508.4746 |
| 44,100 Hz | 358,779.6610 |

**Neither is an integer** — and neither is any bar count I tried at this tempo.
That is exactly why the computation must be done in exact rational arithmetic
and the check passes within **±1 sample**. Floating point and rounding would
give different answers in different implementations, and the whole point of N4
is that the verdict is identical in every one.

Whether the material is *musically* at the session tempo is **not** a protocol
check. Material at the wrong tempo sounds wrong in every client in the same way,
so synchronisation holds.

## The same loop, at different tempi

This is what a fractional bar position does not give. Loop length **in ticks**
does not depend on tempo at all; only its duration in seconds does.

| Tempo | 16 bars in ticks | Duration |
| --- | --- | --- |
| 100 BPM | 61 440 | 38.4000 s |
| 118 BPM | 61 440 | 32.5424 s |
| 120 BPM | 61 440 | 32.0000 s |
| 140 BPM | 61 440 | 27.4286 s |

`61 440` is exactly `16 × ppq × beatsPerBar` = `16 × 960 × 4`. It is an integer
at every tempo, in every implementation, with no rounding — which is why two
loops can be checked for equality by comparing two integers.

## From a bar to a tick

The session is in 4/4 and `ppq` is 960, so one bar is
`ticksPerBar = 960 × 4 = 3 840` ticks.

```
bar 25, beat 1   =  25 × 3 840  =  96 000 ticks
```

With the anchor at 13 September 2026, 00:00:00 UTC and a tempo of 118 BPM, tick
96 000 falls at **00:00:50.847 UTC**. A client never receives that wall clock
time over the wire: it receives the tick `96000` and derives the instant from
the anchor itself.

## N14 in practice

A tick may be negative, because a session may be announced before its anchor.
Three instants before the anchor:

| Instant | Tick | Bar / beat | Truncating division would give |
| --- | --- | --- | --- |
| anchor − 1 ms | **−2** | −1 / 4 | −1 &nbsp;✗ |
| anchor − 500 ms | −944 | −1 / 4 | −944 |
| anchor − 60 000 ms | −113 280 | −30 / 3 | −113 280 |

The first row is the whole of N14 in a single number. One millisecond before the
anchor the correct tick is **−2**, but JavaScript's `/` — and the native
operator of most other languages — truncates toward zero and gives **−1**.

The other two rows reveal nothing: their remainder happens to be zero, so
truncation and flooring agree. Which is why the bug does **not** show up in a
test that tries round numbers — exactly what N5 says about choosing test
vectors.

## What an example cannot show

Two items are still open, and neither can be shown as an example without the
example deciding the matter on the specification's behalf.

**The joining client's message order.** Not specified. The two existing
implementations differ: one sends a joiner `ct.hello` → `ct.session` →
`ct.snapshot` and no `ct.load` messages at all; the other sends a `ct.load` for
every material before the snapshot. The latter has a good reason: without
`ct.load` the client has no `lengthTicks`, so it cannot compute the N10
position, and the slot stays silent permanently. The implementations interoperate
— this is an open item, not an incompatibility.

**The value of the `v` field.** N16 says `v` **must** be a string and that
differing values **must** close the connection, and that version negotiation
**must not** exist. It does not say what the string is. One implementation sends
`commontime/1`, the other `commontime/1.2`, and the cross-run ends at the
handshake in both directions. See [Status](status.md).

Items like these are why [a third implementation](contribute.md) is the most
valuable thing anyone can do with this specification.
