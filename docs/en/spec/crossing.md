# §1 · What crosses the wire?

## Only minimal control information travels the network

- **Synchronisation parameters:** the starting instant (`anchorEpochMs`), the
  tempo (`bpm`), the beats in a bar (`beatsPerBar`) and the clock's resolution
  (`ppq`).
- **Timestamps:** mathematically exact ticks, as integers.
- **Transport commands and parameters:** start (`start`), stop (`stop`), level
  (`gain`), other parameters (`param`), and the material to be played
  (`material`).
- **Identifiers:** the SHA-256 digest that identifies a material uniquely.
- **Diagnostics:** the system's telemetry.

## What is never carried

- Audio signal, or note data such as MIDI.
- AI prompts, model identifiers, directives or suggestions.
- Rights metadata, user identity, or the application's world state.

!!! note "Why the material is pre-rendered audio rather than a note sequence"
    If two different applications played the same note sequence, they would
    produce different audio with different instruments. To guarantee that they
    agree completely, the material must be pre-rendered audio, referred to by an
    unambiguous content digest.

    The protocol carries only what is played (identity) and when it is played
    (time). How the material was originally produced, stretched, resampled or
    generated is left entirely to the client.
