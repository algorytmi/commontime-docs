# Esimerkit

Määrittely kertoo mikä on totta. Tämä sivu näyttää miltä se näyttää luvuissa ja
sanomina.

!!! note "Mikä tällä sivulla on normatiivista"
    Osa esimerkeistä on lainattu suoraan normatiivisesta tekstistä
    (*Common Time Core*, commontime/1, versio 1.2a) — ne on merkitty. Loput
    ovat **toteutusesimerkkejä**: ne kertovat mitä yksi olemassa oleva
    toteutus tekee, eivät sitä mitä protokolla vaatii. Ristiriidassa
    määrittely voittaa, ja kieliversioista englanti.

## Hyväksytty vektori

**Normatiivinen, §7.** Tämä on määrittelyn oma testivektori, ja se on valittu
N5:n mukaan niin että väärä toteutus antaa näkyvästi väärän vastauksen.

```
ping     t0 = 1789232400000
pong     t1 = 1789232401000        vastaus saapui 1789232400200
         → offset = t1 − (t0 + rtt/2) = +900 ms

session  anchor = 1789232400000, bpm = 118, beatsPerBar = 4, ppq = 960

paikallinen kello  1789232460000
         serverNow = 1789232460900    kulunut = 60900
         kelloaskel = 60900 × 118 × 960 / 60000 = 114 979
```

Korjaamaton toteutus — sellainen joka jättää kellojen eron huomiotta — saa
saman hetken arvoksi **113 280**. Ero on **1 699 kelloaskelta**, eli noin
0,9 sekuntia. Se on puolitoista iskua myöhässä, ja se kuuluu.

Tämä on koko vektorin tarkoitus. §7 kertoo myös hylätyn vektorin: 40 ms:n
poikkeama 118 BPM:n tempossa on kaksi prosenttia tahdista, jolloin korjattu ja
korjaamaton vastaus pyöristyvät samaksi luvuksi — ja viallinen toteutus läpäisee
testin.

## Viisi operaatiota

**Normatiivinen, §4.** `ct.cmd`-sanoman `op`-kenttä saa nämä viisi arvoa.
`param` on ainoa laajennuspiste, ja sen nimiavaruus kuuluu sovellukselle.

| `op` | Mitä tekee | `value` | `rampTicks` |
| --- | --- | --- | --- |
| `start` | slot alkaa soittaa materiaaliaan | — | kyllä |
| `stop` | slot lakkaa soittamasta | — | kyllä |
| `gain` | slotin taso | desibeliä | kyllä |
| `param` | sovelluskohtainen parametri | nimi + arvo | kyllä |
| `material` | sijoittaa materiaalin slottiin | tunniste | **ei** |

`material` on hetkellinen sijoitus eikä ota ramppia. `rampTicks = 0` tarkoittaa
paikallista minimiä: asiakas **ei saa** tuottaa epäjatkuvuutta, mutta mekanismia
ei määritellä. Arvoa suurempi kuin 0 tarkoittaa, että arvo saavutetaan välillä
`atTick → atTick + rampTicks`, lineaarisesti parametrin ilmoitetussa yksikössä
(N7).

## Kokonainen istunto

**Toteutusesimerkki, ei normatiivinen.** Tämä vuo on ajettu, ei kirjoitettu:
se on yhden olemassa olevan toteutuksen tuottama liikenne WebSocketin yli
(N11), alusta ensimmäiseen ääneen.

```json
klientti →   {"type":"ct.hello","v":"commontime/1"}
→ klientti   {"type":"ct.hello","v":"commontime/1"}
→ klientti   {"type":"ct.session","id":"kellari-2026-09-13","anchorEpochMs":1789313361186,
              "bpm":118,"beatsPerBar":4,"ppq":960}
klientti →   {"type":"ct.ping","t0":1789313361226}
→ klientti   {"type":"ct.pong","t0":1789313361226,"t1":1789313361227}
→ klientti   {"type":"ct.load","id":1,
              "material":"sha256:3f8a2b1c9d4e5f60718293a4b5c6d7e8f90a1b2c3d4e5f60718293a4b5c6d7e8",
              "lengthTicks":15360}
klientti →   {"type":"ct.ready","ref":1,"readyAtTick":157}
→ klientti   {"type":"ct.cmd","id":1,"atTick":15360,"slot":0,"op":"material",
              "value":"sha256:3f8a…d7e8","rampTicks":0}
→ klientti   {"type":"ct.cmd","id":2,"atTick":15360,"slot":0,"op":"start",
              "value":null,"rampTicks":960}
→ klientti   {"type":"ct.cmd","id":3,"atTick":30720,"slot":0,"op":"gain",
              "value":-6,"rampTicks":3840}
```

Neljä asiaa, jotka kannattaa lukea siitä:

**`ct.load` ei sijoita materiaalia mihinkään.** Se on sisältöosoitteinen haku
ilman slottia. Sijoitus on slotin tilaa ja siksi `ct.cmd`, jonka `op` on
`material` (H21, versiosta 1.1 alkaen). Vuo joka menee `ct.load`ista suoraan
`start`iin jättää slotin tyhjäksi, ja V3 antaa siitä hiljaisuutta.

**Käskyt ajastetaan tulevaisuuteen.** `atTick` 15 360 on neljä tahtia eli 8,14 s
ankkurista. Se on normaali tapa käyttää protokollaa, ei erikoistapaus.

**`readyAtTick` on asiakkaan oma arvio**, ei pyynnön kaiku (N3). Asiakas joka ei
pysty vastaamaan pyyntöön lähettää `ct.refuse`n.

**`ct.cmd`iin ei vastata** eikä sitä kuitata (N3). Myöhästynyt käsky suoritetaan
silti, ja myöhästyminen raportoidaan `ct.state`n `late`-listalla muodossa
`{ id, lateTicks }`.

## Kaksi käskyä kilpailee samasta slotista

**Normatiivinen sääntö (N8), esimerkki havainnollistaa.** Suurin `atTick`
voittaa; tasatilanteessa suurempi `id`.

Slotille 0 tulee kaksi `gain`-käskyä, molemmat `atTick` 30 720. `id` 3 arvolla
−6 ja rampilla 3 840, `id` 4 arvolla −12 ilman ramppia. Sama `atTick`, joten
suurempi `id` voittaa:

```json
{
  "type": "ct.snapshot",
  "atTick": 40000,
  "cmds": [
    {"id":1,"atTick":15360,"slot":0,"op":"material","value":"sha256:3f8a…d7e8","rampTicks":0},
    {"id":2,"atTick":15360,"slot":0,"op":"start","value":null,"rampTicks":960},
    {"id":4,"atTick":30720,"slot":0,"op":"gain","value":-12,"rampTicks":0}
  ]
}
```

Kolme asiaa osoitettavaksi:

- **Häviäjä (`id` 3) ei ole mukana lainkaan.** Tilannekuva on voittaneiden
  käskyjen joukko, ei historia.
- **Voittaja on käsky kokonaisena, ei arvo.** Tilannekuvassa ei lue "gain on nyt
  −12 dB". Tilannekuva **ei saa** kantaa laskettuja arvoja (N8).
- **`start`-käskyn oma `atTick` 15 360 on tallella**, ja se on koko syy sille
  miksi myöhään liittyvä asiakas soittaa oikeaa kohtaa materiaalista. N10 mittaa
  vaiheen voittaneen `start`-käskyn `atTick`istä — eikä sitä lukua ole missään
  muualla kuin siinä käskyssä.

Määrittely mittasi mitä sen puuttuminen maksaisi: ilman tätä myöhään liittyvä
asiakas olisi pielessä **6 976 kelloaskelta**, eli 3,7 sekuntia 8,1 sekunnin
silmukasta (H19).

## Näytemäärän tarkistus

**Normatiivinen, N4.** `ct.load`in yhteydessä asiakkaan on tarkistettava
materiaalin näytemäärä **materiaalin omaa näytetaajuutta** vastaan, ei oman
ulostulonsa:

```
näytteet = lengthTicks × 60 × sampleRate / (ppq × bpm)
```

Neljän tahdin silmukalle (`lengthTicks` 15 360) 118 BPM:n istunnossa:

| Näytetaajuus | Vaadittu näytemäärä |
| --- | --- |
| 48 000 Hz | 390 508,4746 |
| 44 100 Hz | 358 779,6610 |

**Kumpikaan ei ole kokonaisluku** — eikä ole yhdelläkään testaamallani
tahtimäärällä tässä tempossa. Juuri siksi laskenta on tehtävä tarkalla
rationaaliaritmetiikalla ja tarkistus läpäisee **±1 näytteen** sisällä.
Liukulukulasku ja pyöristäminen antaisivat eri vastauksen eri toteutuksissa,
ja N4:n koko pointti on että tuomio on identtinen jokaisessa.

Onko materiaali *musiikillisesti* istunnon tempossa, **ei ole** protokollan
tarkistus. Väärässä tempossa oleva materiaali kuulostaa väärältä jokaisessa
asiakkaassa samalla tavalla, joten synkronointi pitää.

## Sama silmukka, eri tempo

Tämä on se ominaisuus jota murtolukuinen tahtisijainti ei anna. Silmukan pituus
**kelloaskelina** ei riipu tempoista lainkaan; vain sen kesto sekunteina riippuu.

| Tempo | 16 tahtia kelloaskelina | Kesto |
| --- | --- | --- |
| 100 BPM | 61 440 | 38,4000 s |
| 118 BPM | 61 440 | 32,5424 s |
| 120 BPM | 61 440 | 32,0000 s |
| 140 BPM | 61 440 | 27,4286 s |

Luku `61 440` on tasan `16 × ppq × beatsPerBar` = `16 × 960 × 4`. Se on
kokonaisluku jokaisessa tempossa, jokaisessa toteutuksessa, ilman pyöristystä —
ja juuri siksi kahden silmukan yhtäsuuruuden voi tarkistaa vertaamalla kahta
kokonaislukua.

## Tahdista kelloaskeleeksi

Istunnon tahtilaji on 4/4 ja `ppq` on 960, joten yksi tahti on
`ticksPerBar = 960 × 4 = 3 840` kelloaskelta.

```
tahti 25, isku 1   =  25 × 3 840  =  96 000 kelloaskelta
```

Kun istunnon ankkuri on 13.9.2026 klo 00:00:00 UTC ja tempo 118 BPM,
kelloaskel 96 000 osuu hetkeen **00:00:50,847 UTC**. Asiakas ei kuitenkaan
koskaan saa tuota kellonaikaa verkon yli — se saa kelloaskeleen `96000` ja
laskee hetken itse ankkurista.

## N14 käytännössä

Kelloaskel voi olla negatiivinen, koska istunto voidaan ilmoittaa ennen
ankkuriaan. Tässä kolme hetkeä ennen ankkuria:

| Hetki | Kelloaskel | Tahti / isku | Katkaiseva jakolasku antaisi |
| --- | --- | --- | --- |
| ankkuri − 1 ms | **−2** | −1 / 4 | −1 &nbsp;✗ |
| ankkuri − 500 ms | −944 | −1 / 4 | −944 |
| ankkuri − 60 000 ms | −113 280 | −30 / 3 | −113 280 |

Ensimmäinen rivi on koko N14:n pointti yhdessä luvussa. Millisekunti ennen
ankkuria oikea kelloaskel on **−2**, mutta JavaScriptin `/`-operaattori — ja
useimpien muiden kielten — katkaisee kohti nollaa ja antaa **−1**.

Muut kaksi riviä eivät paljasta virhettä: niissä jakojäännös sattuu olemaan
nolla, jolloin katkaisu ja alaspäin pyöristäminen antavat saman vastauksen.
Siksi vika **ei** näy testissä joka kokeilee pyöreitä lukuja — mikä on täsmälleen
se mitä N5 sanoo testivektorien valinnasta.

## Mitä esimerkki ei voi näyttää

Kaksi kohtaa on yhä auki, eikä kumpaakaan voi esittää esimerkkinä ilman että
esimerkki päättäisi asian sivun omin päin.

**Liittyvän asiakkaan sanomajärjestys.** Ei määritelty. Kaksi olemassa olevaa
toteutusta tekee eri tavalla: toinen lähettää liittyjälle `ct.hello` →
`ct.session` → `ct.snapshot` eikä `ct.load`-sanomia lainkaan, toinen lähettää
`ct.load`in jokaisesta materiaalista ennen tilannekuvaa. Jälkimmäisen perustelu
on hyvä: ilman `ct.load`ia asiakkaalla ei ole `lengthTicks`iä, eikä se voi
laskea N10:n mukaista sijaintia, jolloin slot vaikenee pysyvästi. Toteutukset
ovat keskenään yhteensopivia — kyse on avoimesta kohdasta, ei ristiriidasta.

**`v`-kentän arvo.** N16 sanoo että `v` **on** merkkijono ja että eriävät arvot
**on** johdettava yhteyden sulkemiseen, eikä versioneuvottelua **saa** olla.
Se ei sano mikä merkkijono on. Toinen toteutus lähettää `commontime/1`, toinen
`commontime/1.2`, ja ristiin ajo päättyy kädenpuristukseen molempiin suuntiin.
Katso [Tila](status.md).

Näiden kaltaiset kohdat ovat syy siihen miksi
[kolmas toteutus](contribute.md) on arvokkain asia jonka määrittelylle voi
tehdä.
