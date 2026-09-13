# §1 · What crosses the wire

## Carried

- `anchorEpochMs` · `bpm` · `beatsPerBar` · `ppq`
- integer ticks
- `start` · `stop` · `gain` · `param` · `material`
- `sha256:<hex>`
- telemetry

## Never carried

- audio
- note data
- prompts · model identifiers
- rights metadata · user identity
- world state · directives · suggestions

!!! note "Why material is audio, not a sequence"
    Two implementations with different instruments would render the same note
    sequence as different audio. Material is therefore pre-rendered audio,
    addressed by content digest, and the protocol carries only **identity and
    time**. How the material was produced, stretched, resampled or generated is
    not the protocol's business.
