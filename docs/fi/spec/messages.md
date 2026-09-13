# §4 · Kymmenen sanomaa, viisi operaatiota, ei valinnaisia kenttiä

Protokolla käyttää JSON-muotoista dataa WebSocket-yhteyden yli (yksi sanoma per
kehys), ja jokaisessa sanomassa **on oltava** mukana `type`-kenttä.
Protokollassa ei ole valinnaisia kenttiä tai ominaisuuksia, joista laitteet
voisivat erikseen neuvotella. Ainoa laajennusmahdollisuus on sanomien
`param`-kenttä. Tällä varmistetaan se, että jokainen toteutus tukee protokollaa
täysin samanlaisena, eikä sen taakse voi piiloutua puutteellisilla
osatoteutuksilla.

| Sanoma | Suunta | Kentät | Merkitys |
| --- | --- | --- | --- |
| `ct.hello` | molemmat | `v` | Kättely ja versionvarmistus |
| `ct.ping` | asiakas → palvelin | `t0` | Viiveen mittauksen aloitus |
| `ct.pong` | palvelin → asiakas | `t0, t1` | Viiveen mittauksen vastaus |
| `ct.session` | palvelin → asiakas | `id, anchorEpochMs, bpm, beatsPerBar, ppq` | Istunnon ja ajanoton perustiedot |
| `ct.load` | palvelin → asiakas | `id, material, lengthTicks` | Äänimateriaalin latauskäsky |
| `ct.ready` | asiakas → palvelin | `ref, readyAtTick` | Ilmoitus, että materiaali on valmis soitettavaksi |
| `ct.refuse` | asiakas → palvelin | `ref, reason` | Virheilmoitus tai kieltäytyminen latauksesta |
| `ct.cmd` | palvelin → asiakas | `id, atTick, slot, op, value, rampTicks` | Yksittäinen toisto- tai ohjauskäsky |
| `ct.snapshot` | palvelin → asiakas | `atTick, cmds[]` | Istunnon nykytila (kokoelma aktiivisia käskyjä) |
| `ct.state` | asiakas → palvelin | `offsetMs, minRttMs, jitterMs, minLeadTicks, late[], degraded` | Asiakkaan telemetria- ja tilatiedot |

## Kaksi sääntöä, jotka tekevät ohjausliikenteestä täysin ennustettavan

!!! note "N3 · Käskyihin ei vastata (Myöhästynytkin käsky suoritetaan aina)"
    Palvelimen lähettämiin käskyihin (`ct.cmd`) ei vastata erikseen. Jos käskyn
    suoritushetki (`atTick`) on verkon viiveen vuoksi jo mennyt ohi, asiakas
    **suorittaa käskyn silti**.

    Käskyn vaikutus lasketaan matemaattisesti aivan kuin se olisi alkanut
    täsmälleen oikealla hetkellä (`atTick`), ja soitto ”kelataan” nopeasti
    oikeaan kohtaan. Mahdollinen myöhästyminen raportoidaan taustalla
    telemetriassa (`ct.state`), mutta käskyä ei koskaan hylätä pelkän
    myöhästymisen takia.

!!! note "N8 · Tilan monotonisuus (Järjestysriippumattomuus)"
    Jos tietylle kanavalle (`slot`) ja parametrille tulee useita käskyjä,
    suurimman `atTick`-arvon (eli aikajonossa viimeisimmän) omaava käsky voittaa
    aina.

    Tämän ansiosta käskyjen käsittely on täysin järjestysriippumatonta ja
    immuunia verkon pätkimiselle: vaikka kaksi eri asiakaslaitetta saisi samat
    käskyt täysin eri järjestyksessä, ne päätyvät lopulta täsmälleen samaan
    tilaan.

    Myöskään Snapshot (tilannekuva) ei ole mikään erillinen, monimutkainen
    tietorakenne. Se on yksinkertaisesti kokoelma parhaillaan voimassa olevia
    käskyjä, joista jokainen on säilyttänyt alkuperäisen `atTick`-aikaleimansa.
