# Write the third implementation

The two implementations produced **13** and **9** open items. Four of them are
the same item. That is 18 distinct findings and an overlap of 22 %.

Overlap that low is measurable information about what is left.
Capture–recapture puts the findable population at **27–29** items, so roughly
**ten holes are still unfound** — and that is a floor, not an estimate of the
worst case: shared blind spots fall outside the population entirely, and gaps
obvious enough for everyone to find inflate the overlap. Both biases point the
same way.

An implementer finds the gaps that their own structure runs into. One
implementation sends loads to a joining client, so its author hit the joining
message order; the other does not send them, so its author never did. This is
why the useful variable is the number of *implementations*, not the number of
review passes — and why **the most valuable thing anyone can do with this
specification is implement it a third time.**

The more different the structure, the more it finds. Preferably one *without*
arbitrary-precision integers, because that hits N12 and N14 from a direction
neither existing implementation can.

## What predicts divergence

This is the most important finding of the exercise, and it runs against
intuition.

Divergence is **not predicted by the size of the consequence. It is predicted
by the number of natural readings.**

Two measured cases point in opposite directions:

| | Natural readings | Consequence if they differ | Measured |
| --- | --- | --- | --- |
| **H25** · the type of `id` | one (an integer) | V4 — all interoperability | **convergent** |
| **H30** · the value of `v` | two, equally natural | one string | **divergent, stopped the run** |

For H25 the consequence would have been wide, but an integer is so nearly the
only natural reading that two implementers hit it without consulting each other.
For H30 the fix is one string long, but "protocol generation" and "document
version" are both equally natural readings — and the cross-run stopped at the
first message.

Which gives the third implementer a practical rule: **when you meet a field, ask
what its legal values are** — not only what its type is and what follows from a
mismatch. That is exactly the question nobody asked about H30. The
specification answered the type and the consequence, and no one noticed that the
value was still unsaid.

## When to stop

The stopping rule is not the number of findings but the **overlap**. When a new
implementation finds mostly items that are already known, the population is
running out.

22 % is nowhere near that. As long as the overlap is low, the cheapest next move
is another implementation rather than another review pass.

!!! note "Three rules, and the third is the one that matters"
    **Do not fix the specification.** If a passage is unclear, contradictory or
    missing, you do not resolve it — you record it and work around it, or you
    stop. A silent resolution is exactly how two implementations drift apart
    while both look correct.

    **Do not extend the protocol.** Ten messages, five operations, one
    extension point. If something feels missing, it probably belongs to the
    application layer.

    **Write down every guess, at the moment you make it.** A finding with two
    plausible readings that lead to different implementations is worth more
    than working code. A guess that turned out right but was never recorded is
    indistinguishable from luck.

Cite the versioned clause, not the clause: "§2 / commontime/1", never "§2". The
specification is under the same version control as the tests that check it.
