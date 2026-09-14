# §2 · One anchor, an immutable tempo, and exact ticks

A session's time is defined by one fixed instant and three variables. The tempo
**must not** change during a session. Every time value that moves through the
protocol is expressed in ticks. Bars and beats are presentation forms only, and
they belong in the application's user interface — not on the network.

| Field | Meaning |
| --- | --- |
| `anchorEpochMs` | The physical instant of tick 0, in milliseconds. Immutable. |
| `bpm` | The tempo, in quarter notes per minute. Immutable. |
| `beatsPerBar` | The number of beats in a bar (default 4). Immutable. |
| `ppq` | The number of ticks per quarter note. A fixed value of 960. |
| `ticksPerBar` | A derived value: `ppq × beatsPerBar` (3840 when the meter is 4/4). |

This arrangement gives something that a bar position based on floating point or
on fractions cannot: **the length of a loop is always exactly an integer.**
Sixteen bars is always exactly **61 440 ticks**, whether the tempo is 118 or
120 BPM. Because of that, comparing, hashing and testing times for equality are
completely exact in every implementation.

!!! warning "N14 · the first pitfall: rounding a division with negative numbers"
    A tick **must** be derived using floored division (toward negative
    infinity). It **must not** be rounded to the nearest integer, and its
    decimals must not simply be truncated toward zero. Likewise, the remainder
    (modulo) used for a material's position **must** always be non-negative
    (zero or positive).

    This is a critical point, because the native operators of most programming
    languages get it wrong here with negative numbers.

    JavaScript's `BigInt` operations, for example, return the wrong values:

    ```javascript
    // JavaScript BigInt: both are wrong for this protocol
    (-7n) / 2n   // Returns: -3n — truncates toward zero (should be -4n)
    (-7n) % 2n   // Returns: -1n — negative remainder (should be 1n)
    ```

    The correct way to implement the calculation in code:

    ```javascript
    // Correct floored division
    let t = q / 60000n;
    if (q < 0n && q % 60000n !== 0n) {
      t -= 1n;
    }
    ```

    A tick's value **may** perfectly well be negative. This is because a
    performance, or a "set", can be scheduled to begin before the official
    anchor instant. Negative time is not an error or an edge case; it is a
    built-in feature of the protocol for scheduling events.
