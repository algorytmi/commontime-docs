# §2 · One anchor, integer ticks, immutable tempo

A session defines its time with three numbers and one instant. Tempo **must
not** change during a session. Every time value in the protocol is a tick; bars
are a presentation form and belong in the user interface, not on the wire.

| Field | Meaning |
| --- | --- |
| `anchorEpochMs` | Physical instant of tick 0. Immutable. |
| `bpm` | Quarter notes per minute. Immutable. |
| `beatsPerBar` | Default 4. Immutable. |
| `ppq` | Ticks per quarter note. The value is 960. |
| `ticksPerBar` | Derived: `ppq × beatsPerBar` — 3840 in 4/4. |

This is what a fractional bar position does not give: loop length is always an
integer. Sixteen bars is **61 440 ticks** whether the tempo is 118 or 120, so
comparison, hashing and equality are exact in every implementation.

!!! warning "N14 · the first thing an implementer gets wrong"
    A tick **must** be derived using floored division — toward negative
    infinity — not truncation toward zero and not rounding. The remainder used
    for a material position **must** be non-negative. Both differ from the
    native operators of several languages:

    ```javascript
    // JavaScript BigInt: both wrong for this purpose
    (-7n) / 2n   // -3n   — truncates toward zero, want -4n
    (-7n) % 2n   // -1n   — negative remainder, want 1n
    ```

    Done correctly:

    ```javascript
    // Floored division
    let t = q / 60000n;
    if (q < 0n && q % 60000n !== 0n) {
      t -= 1n;
    }
    ```

    A tick **may** be negative, because a session **may** be announced before
    its anchor. That is not an edge case; it is how a set is scheduled.
