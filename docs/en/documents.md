# The specification and everything around it

The normative text is one document. The others exist so that the normative text
does not have to argue for itself, apologise for itself, or keep a diary.

!!! note "The documents are not distributed publicly for now"
    They exist and they are listed below with their versions, but they are not
    published. **Ask for access** by
    [opening an issue](https://github.com/algorytmi/commontime-docs/issues) —
    say what you are building and I will know what you should be reading.

    The reason is measurement, not secrecy. A second independent implementation
    is being written **from the specification text alone**, by an author who
    sees neither the first implementation's code, nor the rationale, nor the
    review register. The cross-run between the two is the only test that says
    whether Common Time is a protocol or a library, and it measures precisely
    what the text alone yields. The rationale contains the resolutions written
    out in prose — and an implementer who reads them implements the
    interpretation rather than the text.

    The specification is the document an implementer needs, and it is available
    on request. The rest opens up once the cross-run has been run.

| Document | Description | Version |
| --- | --- | --- |
| Common Time Core | The normative specification. Authoritative version. | `1.8` |
| Common Time Core | Finnish version. The working version; English takes precedence. | `1.8` |
| Rationale | Four refusals, eight measured decisions, eighteen rejected alternatives. | `1` |
| Implementation plan | Six phases, five of them measurements. One gate each. | `1e` |
| Conformance plan | The test suite as an audit of the specification. Every test cites a clause. | `1d` |
| Roles and open items | Who holds the pen on what, and the twelve items that awaited a decision on 13 Sep — all decided 18–19 Sep 2026. | `2b` |
| Prior art | Around fifty-five comparable systems, and what each one does instead. | `—` |
| How it came about | Non-technical, spoken. Eight chapters and four refusals. | `—` |
| The mark | Thirteen rings, 92 vertices, phase-locked to a common anchor. | `—` |

## Application layer — not the protocol

Common Time exists because something needed it. These documents describe that
something, and they are **not** part of the specification — a conforming
implementation owes them nothing.

| Document | Description | Version |
| --- | --- | --- |
| Musikklubben | The virtual nightclub the protocol was written for. | `MVP` |
| Material pipeline | How generated audio becomes material the protocol can address. | `1a` |
| Operator console | An illustration of a four-deck controller. Not a specification of anything. | `—` |
