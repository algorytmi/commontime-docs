# Where this actually stands

A protocol page that claims to be finished is not telling you anything you can
check. This one is deliberately specific about what is measured and what is not.

| Specification | Implementations | Optional features | Open H-items | Cross-run |
| --- | --- | --- | --- | --- |
| 1.2a | 2 | 0 | 12 | blocked |

The 12 is the count of **numbered** items (H24–H35). More findings than that are
recorded: an implementer records a finding under their own identifier (`F7`,
`F-B2`) and proposes it for review, but the H-number is assigned by the
specification. Some recorded findings are still waiting for one. Which number is
correct depends on which is being asked for, and on this page it is the numbered
ones.

## Decided

Version 1.2a is approved. All twenty-three review items raised during drafting
were addressed. The specification has exactly **one deliberate gap**: the
tolerance value that V1 and V4 refer to. It is absent because the measurement
that determines it has not been performed, and it will be closed by measurement
rather than by discussion.

## Measured

The tick arithmetic passes 34 tests with no dependencies, in integers
throughout. The measurement rig reads a known 10.0000 ms delay correctly — but
only after PHAT weighting was added: unweighted cross-correlation read the same
tape as **0.9086 ms**, exactly two periods off, with a correlation coefficient
of 0.9969 and no warning of any kind. A correct engine holds p95 0.394 ms
against a simulated crystal; a concatenating one breaks at p95 12.47 ms and
drifts 4.37 ms per hour. A system clock step of 250 ms mid-run threw a drift
estimate to −2965 ppm for two minutes when the true figure was +125.

## Not measured

Every number that needs an analogue output and a recorder. The accuracy claims
above are made against a simulated crystal, which is a calibration and not a
measurement, and they are not the tolerance value. Nothing has yet run on two
machines across a real network for three hours, which is the length of a set
and not a safety margin.

## Correction: "blocks" was a prediction, not a measurement

The open-items table used to carry a single column, **Blocks**, and that was a
mistake. The word reported two different quantities as one number:

- **The consequence if implementations differ** is a property of the
  specification, and it can be read from the text.
- **Whether they differ** is a property of the implementations, and it cannot
  be read at all — it has to be run.

Presented as the product of the two, "blocks" is a figure nobody can check. The
column is now split, and the measured column says only what has been run.

Measured against two implementations, **four items thought to block V4 turned
out to be convergent**: `id` as a non-negative integer compared numerically
(H25), `bpm` as an integer (H26), `late[]` cleared on send (H27), and a
parameter's nominal value before the first command (H35). Both implementers
arrived at the same answer without consulting each other. The joining message
order (H32) **passes** when run. They are waiting only for ratification.

See [The ask](contribute.md) for what actually predicts divergence — it is not
the size of the consequence.

!!! note "Why this page says H30 and not H28"
    H-numbers are assigned by the specification, but the implementers cannot
    see the register. Two implementers therefore propose the same number for
    different things — which happened twice in a row. The value of `v` was
    proposed as **H28**, but it is **H30**; the meaning of `minLeadTicks` as
    H29, and it is **H34**. The specification's own H28 and H29 are different
    matters: `ct.state` cannot report the bound §6 refers to, and the smallest
    message size an implementation must accept.

    The collision is nobody's carelessness. It follows from decisions passing
    through an intermediary, and it is this page's most measurable example of
    what that intermediary costs.

## Interoperability no longer waits for hardware

This is the most recent change to the plans, and it separates the
interoperability gate from the hardware gate.

A client that **refuses every load** — `ct.refuse` with reason `missing` — and
stays silent under V3 is fully conforming. A cross-run against such a client proves what a schema cannot:
that two state machines agree about the handshake, the joining order and the
application of a snapshot.

It needs no analogue output, no recorder and not one audio file — and it can be
run the same day H30 is decided, which is before a two-input interface has even
been ordered. Audio is a different gate and different work.

!!! warning "The cross-run is blocked, and that is the gate working"
    Two independent implementations exist. The second was written from the
    specification text alone, by an author who has never seen the first
    implementation's code. Their cross-run does not get past the **first
    message**: N16 requires closing the connection when the `v` values differ,
    but the specification never stated what the value *is*. One sent
    `commontime/1`, the other `commontime/1.2`, and the connection closed
    correctly in both directions.

    Neither author changed their value to match the other. That refusal is the
    point of the exercise: a value agreed between two implementers is a private
    convention that no third party could reproduce. It belongs in the
    specification before it belongs in anybody's source file.

    The item is recorded as **H30**, and it is **the only measured blocker**.
    The recommendation awaiting ratification: `commontime/1`, a compatibility
    token rather than a document version, compared byte for byte rather than
    parsed as a version number, closed with code 4001 — a generic 1000 is
    indistinguishable from a normal close, and the symptom is then "nothing
    happens".
