# Where this actually stands

A protocol page that claims to be finished is not telling you anything you can
check. This one is deliberately specific about what is measured and what is not.

| Specification | Implementations | Optional features | Open items | Cross-run |
| --- | --- | --- | --- | --- |
| 1.2a | 2 | 0 | 12 | blocked |

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
