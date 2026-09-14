# §4 · Ten messages, five operations, no optional fields

The protocol uses JSON over a WebSocket connection, one message per frame, and
every message **must** carry a `type` field. There are no optional fields and no
optional features for devices to negotiate over. The only room for extension is
the messages' `param` field. This ensures that every implementation supports the
protocol in exactly the same form, and that none can hide behind a partial one.

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

!!! note "N3 · commands are never answered (a late command is always executed)"
    Commands sent by the server (`ct.cmd`) are not answered separately. If a
    command's execution instant (`atTick`) has already passed because of network
    delay, the client **executes it anyway**.

    The command's effect is computed mathematically as though it had begun at
    exactly the right instant (`atTick`), and playback is "wound forward" to the
    right point. Any lateness is reported in the background through telemetry
    (`ct.state`), but a command is never discarded merely for being late.

!!! note "N8 · state monotonicity (independence of order)"
    If several commands arrive for a given channel (`slot`) and parameter, the
    one with the highest `atTick` — the latest in the timeline — always wins.

    Because of this, handling commands is entirely independent of order and
    immune to a stuttering network: even if two different client devices receive
    the same commands in completely different orders, they end in exactly the
    same state.

    Nor is a snapshot a separate, complicated data structure. It is simply a
    collection of the commands currently in force, each of which has kept its
    original `atTick` timestamp.
