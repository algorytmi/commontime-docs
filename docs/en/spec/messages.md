# §4 · Ten messages, five operations, no optional fields

JSON over WebSocket, one message per frame, a `type` field on every message.
There is no extension point other than `param`, and there are no optional
features to negotiate — a conformance profile is something an implementation
can hide behind.

| Message | Direction | Fields | Meaning |
| --- | --- | --- | --- |
| `ct.hello` | both | `v` | Handshake and version check |
| `ct.ping` | client → | `t0` | Opens a latency measurement |
| `ct.pong` | → client | `t0, t1` | Answers a latency measurement |
| `ct.session` | → client | `id, anchorEpochMs, bpm, beatsPerBar, ppq` | The anchor and the tempo for the session |
| `ct.load` | → client | `id, material, lengthTicks` | Which material to fetch, and how long it runs |
| `ct.ready` | client → | `ref, readyAtTick` | The material is loaded and playable |
| `ct.refuse` | client → | `ref, reason` | The material was not loaded, and why |
| `ct.cmd` | → client | `id, atTick, slot, op, value, rampTicks` | One playback or control command |
| `ct.snapshot` | → client | `atTick, cmds[]` | Current state: the commands in force |
| `ct.state` | client → | `offsetMs, minRttMs, jitterMs, minLeadTicks, late[], degraded` | Client telemetry and health |

## Two rules that make the control plane replayable

!!! note "N3 · a command is never answered"
    A command whose `atTick` has already passed is **still applied**, and its
    effect is computed as if it had been applied at `atTick`. Lateness is
    reported in telemetry, not negotiated. A command is never discarded for
    lateness alone.

!!! note "N8 · state monotonicity"
    For a given slot and parameter, the command with the highest `atTick` wins.
    Application is therefore idempotent and order-independent: two clients
    receiving the same commands in different orders arrive at the same state. A
    snapshot is not a special structure — it **is** the set of winning
    commands, each with its original `atTick`.
