# §6 · Requirements define the outcome — not the method

The specification dictates only what the audio must sound like at any given
instant — not how that is reached. The method is free: an implementation may
insert samples, trim the playback rate on the fly, or reschedule. If two
different programs reach the same outcome by *different* means, that is simply a
demonstration that the protocol is flexible.

| Identifier | Outcome required (what the program must achieve) |
| --- | --- |
| **V1** | The audio leaving the speakers must correspond to the session's current tick, within the permitted margin of error. The method is free. |
| **V2** | Every new iteration of a loop must begin directly from the session's shared time — never from the end of the previous iteration. Chaining iterations one after another accumulates timing error and is therefore **forbidden**. |
| **V3** | If a device is missing the audio file it needs, that slot (`slot`) **must be silent**. Playback must not be delayed, the file must not be substituted, and a missing file must never stall the shared session for the other devices. |
| **V4** | If a device determines that it can no longer keep to the shared time, it must **stop emitting audio entirely** and report the `degraded` state. Failing clearly and immediately is an obligation, because a device drifting imperceptibly out of time spoils the shared music worse than one that has gone silent. |

!!! note "The limit of audio accuracy (handling uncertainty in time)"
    The protocol does not promise absolute, perfect alignment to the server's
    clock, because the laws of physics make that impossible. The outbound path
    may take a different time than the return path (path asymmetry), and no
    program can detect this from the inside. That creates an unavoidable error
    in the timeline, bounded by **±minRTT / 2** (half of the lowest round-trip
    time).

    Measuring the offset must therefore use the *lowest* observed round-trip
    time (minRTT). Using the mean or the median is **forbidden**, because
    neither removes the asymmetry caused by network queueing. An implementation
    must report `minRttMs` directly, and must not attempt to present the
    measured offset as exact.
