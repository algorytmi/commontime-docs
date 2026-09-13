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

!!! warning "If you copy this flow"
    **The value of `v` is this implementation's choice, not a decision.** The
    specification gives the field's type and what follows from a mismatch, but
    not what the string is — see the last section of this page.

    **`sha256:3f8a…d7e8` is an abbreviation for reading, not a valid
    identifier.** N13 requires exactly 64 hex characters in lower case, and the
    abbreviated form does not parse — a validator rejects it. The full value is
    on the `ct.load` line above.

    **`anchorEpochMs` is the clock at the time of the run**, not a constant. A
    copier gets a session whose anchor is in the past. That is in fact useful —
    N10's phase and late commands show up immediately — but it is not a number
    to quote as given.

## A late command

**Implementation example, not normative.** N3 says a late command **is still
applied**, and that the lateness is reported in the `late` list of `ct.state`.
One executed `ct.state` shows three different magnitudes at once — and the
magnitude tells you which case it is:

```json
{"type":"ct.state","offsetMs":0,"minRttMs":0,"jitterMs":1,"minLeadTicks":567,
 "late":[{"id":1,"lateTicks":113480},
         {"id":2,"lateTicks":113480},
         {"id":3,"lateTicks":2},
         {"id":4,"lateTicks":20002}],
 "degraded":false}
```

| `id` | `lateTicks` | What it is |
| --- | --- | --- |
| 3 | **2** | `atTick` was "now". Late by the wire alone — 2 ticks is 1.06 ms at 118 BPM, because one millisecond is 1.888 ticks. |
| 4 | **20,002** | A command from the past, deliberately 20,000 ticks. The other 2 is the same wire delay as `id` 3. |
| 1, 2 | **113,480** | The session's opening commands at `atTick` 0, with the anchor about 60 s ago. |

**Single digits are the network; five digits are history.** That is a practical
rule you can read straight off the number.

And from the same run, the proof that the commands were **applied** rather than
discarded: slot 0's `gain` is −6 dB (command `id` 3), `param cutoff` is 800
(command `id` 4, the one 20,000 ticks late), and the slot is sounding.

!!! note "A caveat about the magnitude"
    This run is a loopback, so `minRttMs` is 0 and `id` 3's two ticks are a
    **floor**. A local network adds a fraction of a millisecond, so the figure
    stays in single digits.

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

## A client joining mid-loop

**Implementation example, not normative.** This is N10's phase as concrete
numbers — the thing a hand-written example cannot prove. The joiner arrives
during the seventh iteration:

```json
{"type":"ct.snapshot","atTick":113289,
 "cmds":[
   {"id":1,"atTick":0,   "slot":0,"op":"material","value":"sha256:3f8a…d7e8","rampTicks":0},
   {"id":2,"atTick":5760,"slot":0,"op":"start",   "value":null,"rampTicks":0},
   {"id":3,"atTick":9600,"slot":0,"op":"gain",    "value":-6,  "rampTicks":0}]}
```

N10 by hand, with the joiner's own numbers:

```
T (the joiner's tick now)      113 600
startAtTick                      5 760   ← the winning start command's own atTick,
                                           NOT the snapshot's atTick 113 289
lengthTicks                     15 360

T − startAtTick                107 840
107 840 mod 15 360                 320   ← the phase, and it is not zero
iteration                            7
```

Two lines are worth reading twice. **`startAtTick` is 5,760 and not 113,289** —
the snapshot's own timestamp is no good for measuring phase. And **the phase is
320, not 0** — the joiner does not start from the top of the material. Both
were bugs before version 1.1, and both cost a measured 6,976 ticks.

### Why N1 binds the wire and not the read head

From the same instant the implementation computed a phase of **320.9600** ticks,
not 320. The difference is exactly `exactTick − floor(exactTick)` — the floor
and nothing else. And that is deliberate:

| | Phase | Sample in the material |
| --- | --- | --- |
| Control plane, integer tick (N1) | 320 | 8,135.6 |
| Read head, fractional tick | 320.9600 | 8,160.0 |

The difference is **24.4 samples, or 0.5 ms** — and it is exactly the floor:
`0.96 × 25.42` samples per tick is 24.4. The same remainder shows up in both
units, and nothing else separates these two rows.

One tick is 25.42 samples at 48 kHz, so a read head quantised to whole ticks
would step audibly. N1 requires
integers **on the control plane** — it is a promise that two implementations
agree about time, not a requirement about how audio is rendered.

!!! danger "Finding F19 · running this example exposed a gap"
    The joiner's first `ct.state` carried `late: []` — even though it had just
    received three commands whose `atTick` is 113,600 ticks in the past.

    Two normative sentences point in different directions. **N3:** lateness
    **must** be reported in the `late` list. **N8:** `ct.snapshot` is not a
    special case but a set of `ct.cmd` payloads. Every command in a snapshot
    has an `atTick` in the past by definition — that is the whole reason a
    snapshot exists. **Which sentence wins is nowhere.**

    The consequence if implementations differ: under one reading, every
    joiner's first `ct.state` is a burst with one element per slot and
    parameter — which means **a joining client looks identical in telemetry to
    a client that has just lost the network.** And joins happen exactly when
    telemetry is being read alongside a recording.

    The item is recorded as an **unnumbered** finding and has not been
    addressed. H-numbers are assigned by the specification.

!!! warning "What in these flows is the implementation's choice"
    With the same caveat as the value of `v` — none of these are dictated by
    the specification:

    - **`minLeadTicks` 567** is the *required* lead, `ceil(300 ms × 1.888)`.
      Item **H34** is open, and worse than a gap: §4 gives the field no meaning
      at all, and the non-normative Appendix A says "observed" where this
      implementation reports required. The 300 ms is the implementation's own.
    - **`jitterMs` 1** — the specification does not say how jitter is computed.
      Here it is the highest minus the lowest RTT over the last 64 samples.
    - **`offsetMs` 0** — N6 gives the formula, but what happens to the half
      millisecond is the implementation's choice (an unnumbered finding).
    - **The order of `cmds[]`** — N8 says "a set", so the order is free. Here it
      is slot, `atTick`, `id`.
    - **The anchor and the session id** are application layer, not protocol.

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

## The material pipeline in practice

!!! warning "Application layer — not the protocol"
    Everything in this section is **one application's** choices. §5 of the
    specification puts retrieval of the bytes outside its scope, and the
    protocol does not know what material is musically — no roles, no
    instruments, no genre. A conforming implementation owes none of this
    anything. It is here because it shows what one real material source looks
    like.

What the pipeline produces: **Ogg Opus**, 48,000 Hz, stereo, 96 kbit/s VBR,
20 ms frames. One file per role, 3–6 roles per track, typically 16 bars at
118 BPM — 32.54 s and 330–460 kB per role. Materials are loops, not one-shots,
which is what the protocol requires (N9): a slot's material loops from `start`
until `stop`, and one-shot playback does not exist.

The digest is computed over the **finished .ogg bytes**, not over the source
and not before encoding, and the whole `sha256:<hex>` including the prefix goes
into the `material` field.

### `lengthTicks` is derived from bars, not from the file

This is where material and protocol meet, and the direction is the opposite of
what one might expect:

```
lengthTicks = bars × beatsPerBar × ppq  =  16 × 4 × 960  =  61 440
samples     = lengthTicks × 60 × sampleRate / (ppq × bpm)
            = 61 440 × 60 × 48 000 / (960 × 118)
            = 92 160 000 / 59
            = 1 562 033.8983…  →  1 562 034
```

The file is not measured and the length is not derived from it. The length is
computed from bars and **the file is cut to fit**: the pipeline generates
something overlong, detects the tempo, stretches by at most 5 %, picks a musical
cut point and trims exactly the computed sample count. The seam is crossfaded
from the surplus, so the fade does not change the length.

Note what the exact value is: `92,160,000 / 59`. The denominator is 59, so the
number **cannot be an integer** at any bar count at this tempo. Rounding happens
only at the end, and N4's gate accepts ±1 sample. Here the deviation is 0.1017
samples.

### Roles and slots

The protocol knows only numbered slots. The mapping from role to slot is an
**application convention**, not the protocol's:

| Slot | 0 | 1 | 2 | 3 | 4 | 5 |
| --- | --- | --- | --- | --- | --- | --- |
| Role | DRUMS | BASS | SEQ | CHORD | LEAD | VOX |

A missing role is silence in its own slot, not an error — which is exactly what
V3 requires.

### Three things that went wrong, all measured

**Opus does not preserve peak.** An encoded file can exceed the source's true
peak by roughly 0.4–0.6 dB. If the peak is measured from the wav before
encoding, tracks reach playback over zero. The peak must be measured from the
**decoded** Opus. This is structurally the same mistake as N14: the correct
figure only exists after the conversion, and the figure measured before it looks
entirely plausible.

**Granule position is not duration.** The last granule of an Ogg Opus file
includes the pre-skip, so the correct duration is
`(last granule − pre-skip) / 48000`. Without the subtraction every loop is a few
milliseconds too long — and since V2 forbids concatenating iterations the error
does not accumulate in playback, but it makes a file that N4's check rejects.

**The sum of six stems is not one stem.** Six tracks each normalised to −14 LUFS
summed to +10.2 dBFS and clipped 1.8 % of samples. The sum is now normalised
with one common gain, which preserves the relative levels between tracks.

!!! note "Open: no real multi-client session has been run"
    On the material side only a single-deck run has been measured. Publishing
    is three HTTP calls and playback starts with one, which reads a track's
    arrangement and sends `start` commands at each section's first bar — 64
    bars, at most three tracks at once. But several clients have not been run
    together over a real network, so there is no figure for it here.

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
implementations differ (item **H32**): one sends a joiner `ct.hello` →
`ct.session` → `ct.snapshot` and no `ct.load` messages at all; the other sends a
`ct.load` for every material before the snapshot. The latter has a good reason: without
`ct.load` the client has no `lengthTicks`, so it cannot compute the N10
position, and the slot stays silent permanently. The implementations
interoperate: H32 **passes** when run. This is an open item, not an
incompatibility.

**The value of the `v` field.** N16 says `v` **must** be a string and that
differing values **must** close the connection, and that version negotiation
**must not** exist. It does not say what the string is. One implementation sends
`commontime/1`, the other `commontime/1.2`, and the cross-run ends at the
handshake in both directions. The item is **H30**, and it is the only measured
blocker. See [Status](status.md).

Items like these are why [a third implementation](contribute.md) is the most
valuable thing anyone can do with this specification.
