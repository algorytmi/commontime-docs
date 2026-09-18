# Where this actually stands

A protocol page that claims to be finished is not telling you anything you can
check. This one is deliberately specific about what is measured and what is not.

| Specification | Implementations | Optional features | Open H-items | Cross-run |
| --- | --- | --- | --- | --- |
| 1.2a | 2 | 0 | 15 | not run |

The 14 is the count of **numbered** open items (H24–H39, of which H30 is
decided). It has moved every time something was found: H30 was settled and
left, F19 became H36, the snapshot fault became **H37**, and the most recent
one, reproduced in production, became **H38**; reading the fix for H38 then turned up **H39**.

The last three were found by **running**, not by reading — two of them in
production. More findings than that are
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

The tick arithmetic passes **47 tests** with no dependencies, in integers
throughout: `ct-core` pulls in nothing and touches no audio, no network and no
browser. The whole suite — `ct-core`, the client, the clock server and
conformance together — is 155 tests, with the rig's calibration another 18
beside it. The measurement rig reads a known 10.0000 ms delay correctly — but
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
out to be convergent** — but two of them more narrowly than was first recorded:

| Item | What the convergence covers |
| --- | --- |
| **H25** `id` | The form (a non-negative integer) and the comparison (numeric). **Not the upper bound:** one requires the 53-bit safe limit, the other only an integer, and they differ from 2⁵³+2 upward. A counter that only increases never reaches it, so no ordinary run can measure the difference. |
| **H26** `bpm` | The number type and the range, without reservation. |
| **H27** `late[]` | Cumulativity and the computation of `lateTicks`, without reservation. |
| **H35** `gain` | **Only `gain`'s** zero. The register's heading spoke of a parameter's nominal value in general, but both implementers' evidence concerns `gain` — a `param` has no meaningful zero, because the namespace belongs to the application and the value need not be numeric (N15). |

Both implementers arrived at the same answer without consulting each other, and
for H27 at the same **chain of reasoning**: one derived the clearing of the list
separately, from the same argument. The joining message order (H32) **passes**
when run. They are waiting only for ratification.

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

!!! warning "The cross-run stopped at the first message, and that was the gate working"
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

    The item was recorded as **H30**, and for a long time it was the only
    measured blocker.

    **H30 was decided on 13 September 2026.** The value is `commontime/1`. It is
    a **compatibility token, not a document version** — it changes if and only
    if the wire breaks, and 1.1, 1.2, 1.2a and the coming 1.3 do not change it.
    The comparison is byte for byte, not parsed as a version number and not
    normalised. On a mismatch the connection closes with code **4001**; a
    generic 1000 is indistinguishable from a normal close, and the symptom would
    then be "nothing happens".

    The reasoning rests on N16's own logic rather than on either implementer's
    value. N16 forbids version negotiation and requires closing on mismatch, so
    if `v` carried the document version, **every editorial correction would
    sever every running connection.** Version 1.2a was a non-normative fix to a
    single sentence of rationale. And the specification had been showing the
    answer at the top of every page without stating it:
    `commontime/1 · version 1.2 · approved 13 September 2026` already separates
    the token from the version typographically.

    **What the decision changed, and what it did not.** One word will not do,
    because these are two different quantities — the same distinction H25 and
    H26 taught, now applied to the outcome of their own resolution:

    | | Cross-run |
    | --- | --- |
    | **Specification** | does not block it — N16's gap is closed |
    | **Measured** | **not yet run** — both implementations now send `commontime/1`, but the cross-run has not been executed |

    The decision changed the upper row, not the lower one. The control-plane
    cross-run is clear as far as the specification goes, but it has not been run
    and cannot be until B adopts the value — and until then A closes the
    connection exactly as N16 requires. Audio remains a separate gate after
    that.

    **The decision was verified against an implementation**, not merely
    recorded: the value (including that it is not 1.1, 1.2 or 1.2a), the byte
    comparison against nine near misses — a space at either end, a newline, case
    twice, `commontime/1.0` read as a version number, `commontime/10`,
    `commontime` as a prefix, and B's `commontime/1.2` — and close code 4001,
    together with its falling in the application range 4000–4999. All three as
    tests.
