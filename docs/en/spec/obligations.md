# §6 · Obligations are outcomes, not mechanisms

The specification says what must be true of the audio, not how to achieve it.
Sample insertion, playback-rate trim, rescheduling — choose freely. Two
implementations that pass with *different* mechanisms is a good result, because
it proves the obligation is mechanism-independent.

| | Outcome required |
| --- | --- |
| **V1** | The sample leaving the output corresponds to the current session tick within tolerance. The mechanism is deliberately unspecified. |
| **V2** | Each loop iteration derives its start from session time — never from the end of the previous one. Concatenation accumulates error and is forbidden. |
| **V3** | Material a client does not have is **silence for that slot**. Not a delay, not a substitute, and never a stalled session for everyone else. |
| **V4** | A client that cannot meet its bound stops emitting audio and reports `degraded`. Failing loudly is an obligation, because a client that drifts quietly is worse than one that stops. |

!!! note "The limit of accuracy, stated on purpose"
    The protocol **must not** guarantee absolute alignment to the server clock.
    Path asymmetry introduces a bias that cannot be detected from inside the
    protocol at all, and it is bounded by **±minRTT/2**. Offset sampling must
    therefore select the sample with the *lowest* round-trip time — not the
    median, which does not remove queueing asymmetry — and an implementation
    must report `minRttMs` and must not present the offset as exact.
