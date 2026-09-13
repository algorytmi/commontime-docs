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

## The five operations

The `op` field of `ct.cmd` takes these five values. The core operations
guarantee interoperability; `param` is the only extension point, and its
namespace belongs to the application.

| `op` | What it does | `value` | `rampTicks` |
| --- | --- | --- | --- |
| `start` | slot begins playing its material | — | yes |
| `stop` | slot stops playing | — | yes |
| `gain` | slot level | decibels | yes |
| `param` | application-defined parameter | name + value | yes |
| `material` | assigns material to the slot | identifier | **no** |

`material` is an instantaneous assignment and takes no ramp. Note that
`ct.load` does **not** assign material to a slot — it is a content-addressed
fetch with no slot, and assignment is slot state and therefore a command.

The material model is deliberately thin: a session has numbered **slots**, and
a slot is either empty or holds material. The protocol does not know what
material is musically — no roles, no instruments, no genre.

A material identifier **must** be of the form `sha256:<hex>` in lower case. A
client **must** accept and retain a `param` name it does not recognise; the
prefix `ct.` is reserved for future versions of the protocol and an application
**must not** use it.

See [Examples](../examples.md) for a complete message flow and for what a
snapshot looks like when two commands compete for one slot.

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
