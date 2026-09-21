# Write the third implementation

The two implementations produced **13** and **9** open items. Four of them are
the same item. That is 18 distinct findings and an overlap of 22 %.

Overlap that low is measurable information about what is left.
Capture–recapture puts the findable population at **27–29** items, so roughly
**ten holes are still unfound** — and that is a floor, not an estimate of the
worst case: shared blind spots fall outside the population entirely, and gaps
obvious enough for everyone to find inflate the overlap. Both biases point the
same way.

**Three faults, three ways of finding them.** Between 19 and 21 September
2026 three faults were found in production code. The first turned up while an
implementer was looking in the wrong file for something else. The second came
from a listing that walks the whole acceptance surface and asks nobody what is
worth testing. The third came from a question neither implementer would have
thought to ask itself. **Only one of the three would have been caught by a
test written in advance** — which is the same reason this page asks for a
third implementation rather than a third review pass.

**Measured afterwards.** That was computed on 13 September 2026. Since then
eleven more items have been numbered (H36–H46) — seven of them on one day,
19 September, by asking both implementations the same questions of their
code and comparing the answers. "Roughly ten unfound" was met in six days
without a third implementation, and the floor was a floor: nothing says the
population is now empty.

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

!!! warning "And a refinement that cost a production fault"
    The rule is not "how many readings can I think of". An implementer
    considered one such item, reasoned that the other reading had no credible
    reader, and **rejected the finding on that basis.** The other implementation
    read it exactly that way, and the result was a production fault (H37).

    **Two plausible readings does not mean two sensible readings. It means two
    that somebody actually reads.** Judging whether a reading is credible is the
    same act as resolving the gap, and it fails the same way. Record the
    finding; do not assess the reader.

Which gives the third implementer a practical rule: **when you meet a field, ask
what its legal values are** — not only what its type is and what follows from a
mismatch. That is exactly the question nobody asked about H30. The
specification answered the type and the consequence, and no one noticed that the
value was still unsaid.

## The test that could not have failed

This project has run into one shape of mistake four times, in four different
places, and each time it looked like a different fault. It is worth learning the
name before writing a single test: **the instrument was right about what it
measured, it just did not measure what anyone thought.**

| Where | How it looked | What was happening |
| --- | --- | --- |
| A rejected test vector (N5) | Passed | A 40 ms offset at 118 BPM is two percent of a bar, so the corrected and uncorrected answers rounded to the same number |
| The cross-correlation coefficient | 0.9969 — near perfect | The answer was entirely wrong: 10.0000 ms read as 0.9086 ms, off by exactly two periods. The coefficient cannot see periodicity bias at all |
| A five-minute run | Practically clean, 0.27 ms | The same implementation breaks at 12.47 ms over three hours. A concatenation fault does not show in a short run |
| This site's own snapshot example | Worked | It carries no `stop`, and **worked because of that** — it showed the matter settled when it is not (H37) |

The first three are measured figures. The fourth was on this site, and an
implementer found it, not a review.

A practical rule for the third implementer: **a passing test tells you nothing
unless it could have failed.** Write down, for every test, the wrong answer it
is supposed to reject — if you cannot write that, the test discriminates
nothing. It is the same requirement N5 places on test vectors, and it holds for
examples just as well: an example that succeeds only because it avoids the hard
case is more dangerous than a missing example.

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
