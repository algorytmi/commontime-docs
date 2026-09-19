# Esimerkit

Määrittely kertoo mikä on totta. Tämä sivu näyttää miltä se näyttää luvuissa ja
sanomina.

!!! note "Mikä tällä sivulla on normatiivista"
    Osa esimerkeistä on lainattu suoraan normatiivisesta tekstistä
    (*Common Time Core*, commontime/1, versio 1.4) — ne on merkitty. Loput
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

!!! warning "Jos kopioit tämän vuon"
    **`v`:n arvo on nyt päätetty (H30), ja se on `commontime/1`.** Se on
    yhteensopivuustunnus eikä dokumentin versio: se ei muuttunut versioiden
    1.3 eikä 1.4 mukana. Älä kopioi siihen määrittelyn versionumeroa.

    **`sha256:3f8a…d7e8` on lyhennys lukemista varten, ei kelvollinen
    tunniste.** N13 vaatii tasan 64 heksamerkkiä pienaakkosin, ja lyhennys ei
    jäsenny — validaattori hylkää sen. Täysi arvo on `ct.load`-rivillä yllä.

    **`anchorEpochMs` on ajohetken kello**, ei vakio. Kopioija saa istunnon
    jonka ankkuri on menneisyydessä. Se on itse asiassa hyödyllistä — N10:n
    vaihe ja myöhästyneet käskyt näkyvät heti — mutta se ei ole luku jota
    kannattaa lainata sellaisenaan.

## Myöhästynyt käsky

**Toteutusesimerkki, ei normatiivinen.** N3 sanoo että myöhästynyt käsky
**suoritetaan silti** ja että myöhästyminen raportoidaan `ct.state`n
`late`-listalla. Yksi ajettu `ct.state` näyttää kolme eri mittaluokkaa
kerralla — ja mittaluokka kertoo mistä tapauksesta on kyse:

```json
{"type":"ct.state","offsetMs":0,"minRttMs":0,"jitterMs":1,"minLeadTicks":567,
 "late":[{"id":1,"lateTicks":113480},
         {"id":2,"lateTicks":113480},
         {"id":3,"lateTicks":2},
         {"id":4,"lateTicks":20002}],
 "degraded":false}
```

| `id` | `lateTicks` | Mistä on kyse |
| --- | --- | --- |
| 3 | **2** | `atTick` oli "nyt". Myöhässä vain langan verran — 2 tikkiä on 1,06 ms tempossa 118, koska yksi millisekunti on 1,888 tikkiä. |
| 4 | **20 002** | Käsky menneisyydestä, tarkoituksella 20 000 tikkiä. Loput 2 on sama langan viive kuin id 3:lla. |
| 1, 2 | **113 480** | Istunnon avauskäskyt `atTick`illa 0, ankkuri noin 60 s sitten. |

**Yksinumeroinen on verkkoa, kymmentuhantinen on historiaa.** Se on käytännön
sääntö jonka lukee suoraan luvusta.

Ja samasta ajosta todiste siitä että käskyt **sovellettiin** eikä hylätty:
slotin 0 `gain` on −6 dB (käsky id 3), `param cutoff` on 800 (käsky id 4, joka
oli 20 000 tikkiä myöhässä), ja slot soi.

!!! note "Varaus mittaluokkaan"
    Tämä ajo on silmukkatakaisinkytkentä, joten `minRttMs` on 0 ja id 3:n kaksi
    tikkiä on **alaraja**. Lähiverkko lisää murto-osan millisekunnista, eli
    luku pysyy yksinumeroisena.

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

!!! danger "H37 · pelkät voittajat eivät riitä, ja tämä esimerkki ei näytä sitä"
    Yllä olevassa tilannekuvassa ei ole `stop`-käskyä, ja siksi se toimii. Jos
    lähde ajoittaa `start`in ja sen oman `stop`in etukäteen — mitä osion
    käynnistys tai ristivaihto tekee — niin koko sen ajan kun slot soi
    **suurin `atTick` kuuluu lopetukselle.** Pelkkien voittajien tilannekuva
    kertoo liittyjälle milloin raita loppuu eikä koskaan että se soi, jolloin
    `startAtTick` puuttuu eikä N10:n vaihetta voi laskea lainkaan.

    Toteuttaja havaitsi tämän **tuotannossa**: sivun lataus kesken kappaleen
    jätti selaimen hiljaiseksi koko kappaleen ajaksi, muiden kuullessa
    musiikin normaalisti — ja lokit näyttivät terveiltä.

    Mitattuna **molemmat olemassa olevat toteutukset rikkoutuvat tästä, mutta
    vastakkaisiin suuntiin.** Toinen menettää `start`in ja vaikenee. Toinen
    rajaa arvioinnin muotoon `atTick ≤ nyt`, joten sen liittyjä löytää `start`in
    ja vaihe on oikein — mutta ajoitettu `stop` katoaa tilannekuvasta, eikä
    liittynyt asiakas koskaan lopeta. Jälkimmäinen oire on vaikeampi tunnistaa,
    koska se on **äänekäs eikä hiljainen**: kappaleen jälkeen yksin soittava
    asiakas kuulostaa ensin siltä että joku unohti napin.

    Kaksi asiaa on määrittelemättä yhtä aikaa: mikä on "parametri" `start`in ja
    `stop`in kohdalla, ja tarkoittaako *voittaa* korkeinta `atTick`iä vai
    korkeinta `atTick`iä joka ei ole arviointihetkeä myöhempi. Jälkimmäistä
    rajausta ei ole tekstissä. **Ratifioitu 18.9.2026:** tilannekuva kantaa
    voimassa olevan käskyn ja kaikki sitä myöhemmät, ja *voittaa* tarkoittaa
    suurinta `atTick`iä joka ei ole arviointihetkeä myöhempi.

## Liittyjä kesken silmukan

**Toteutusesimerkki, ei normatiivinen.** Tämä on N10:n vaihe konkreettisina
lukuina — se mitä käsin kirjoitettu esimerkki ei pysty todistamaan. Liittyjä
tulee kesken seitsemättä kierrosta:

```json
{"type":"ct.snapshot","atTick":113289,
 "cmds":[
   {"id":1,"atTick":0,   "slot":0,"op":"material","value":"sha256:3f8a…d7e8","rampTicks":0},
   {"id":2,"atTick":5760,"slot":0,"op":"start",   "value":null,"rampTicks":0},
   {"id":3,"atTick":9600,"slot":0,"op":"gain",    "value":-6,  "rampTicks":0}]}
```

N10 käsin, liittyjän omilla luvuilla:

```
T (liittyjän kelloaskel nyt)   113 600
startAtTick                      5 760   ← voittaneen start-käskyn oma atTick,
                                           EI tilannekuvan atTick 113 289
lengthTicks                     15 360

T − startAtTick                107 840
107 840 mod 15 360                 320   ← vaihe, ei nolla
kierros                              7
```

Kaksi riviä kannattaa lukea kahdesti. **`startAtTick` on 5 760 eikä 113 289** —
tilannekuvan oma aikaleima ei kelpaa vaiheen mittaamiseen. Ja **vaihe on 320
eikä 0** — liittyjä ei aloita materiaalin alusta. Kumpikin oli virhe ennen
versiota 1.1, ja kumpikin maksoi mitattuna 6 976 tikkiä.

### Miksi N1 koskee lankaa eikä lukupäätä

Toteutus laski samasta hetkestä vaiheeksi **320,9600** tikkiä, ei 320. Ero on
tasan `exactTick − floor(exactTick)`, eli pelkkä lattia. Ja se on tarkoitus:

| | Vaihe | Materiaalin näyte |
| --- | --- | --- |
| Ohjauskaista, kokonaislukutikki (N1) | 320 | 8 135,6 |
| Lukupää, murtolukutikki | 320,9600 | 8 160,0 |

Ero on **24,4 näytettä eli 0,5 ms** — ja se on tasan se lattia: `0,96 × 25,42`
näytettä per kelloaskel on 24,4. Sama jakojäännös näkyy kummassakin yksikössä,
eikä mikään muu erota näitä kahta riviä toisistaan.

Yksi kelloaskel on 25,42 näytettä 48 kHz:llä, joten kokonaislukuun kvantisoitu
lukupää askeltaisi kuuluvasti.

**Ja yksi toteutuksen valinta, joka seuraa suoraan V2:sta.** Tämä toteutus
venyttää materiaalin silmukan tarkkaan kestoon sen sijaan että soittaisi sen
ykkösnopeudella ja katkaisisi lopusta. Tiedoston poikkeamasta tulee silloin
vakiovire — tässä tapauksessa **1,215 ppm** — joka nollautuu joka
kierroksella, koska V2 vaatii että jokaisen kierroksen alku johdetaan istunnon
ajasta eikä edellisen lopusta. Ykkösnopeus jättäisi sen sijaan alle näytteen
raon jokaiselle kierrokselle, ja se olisi naksu eikä vire.
N1 vaatii kokonaislukuja **ohjauskaistalla** — se on lupaus siitä että kaksi
toteutusta on samaa mieltä ajasta, ei vaatimus siitä miten ääni renderöidään.

!!! danger "H36 · tämän esimerkin ajaminen paljasti aukon"
    Liittyjän ensimmäinen `ct.state` oli `late: []` — vaikka se oli juuri
    saanut kolme käskyä, joiden `atTick` on 113 600 tikkiä menneisyydessä.

    Kaksi normatiivista lausetta osoittaa eri suuntiin. **N3:** myöhästyminen
    **on** raportoitava `late`-listalla. **N8:** `ct.snapshot` ei ole
    erikoistapaus vaan joukko `ct.cmd`-kuormia. Tilannekuvan jokaisen käskyn
    `atTick` on määritelmän mukaan menneisyydessä — se on koko syy sille että
    tilannekuva on olemassa. **Kumpi lause voittaa, ei ole missään.**

    Seuraus jos toteutukset eroavat: toisessa tulkinnassa jokaisen liittyjän
    ensimmäinen `ct.state` on purske, jossa on yksi alkio per slotti ja
    parametri — eli **liittyvä asiakas näyttää telemetriassa identtiseltä kuin
    asiakas jolta on juuri kadonnut verkko.** Ja liittymisiä tapahtuu juuri
    silloin kun telemetriaa luetaan nauhoituksen rinnalla.

    Toteuttaja kirjasi kohdan tunnuksella `F19`; määrittely antoi sille
    numeron **H36** 13.9.2026. **Ratifioitu 18.9.2026:** tilannekuvasta
    sovellettu käsky ei ole myöhässä eikä esiinny `late[]`-listalla.

!!! warning "Mikä näissä vuoissa on toteutuksen valintaa"
    Samalla varauksella kuin `v`:n arvo — nämä eivät ole määrittelyn sanelemia:

    - **`minLeadTicks` 567** on *tarvittava* ennakko, `ceil(300 ms × 1,888)`.
      Kohta **H34** on auki, ja pahemmin kuin aukkona: §4 ei anna kentälle
      merkitystä lainkaan, ja ei-normatiivinen liite A sanoo "havaittu" siinä
      missä tämä toteutus raportoi tarvittavaa. Luku 300 ms on toteutuksen oma.
    - **`jitterMs` 1** — määrittely ei sano miten jitter lasketaan. Tässä se on
      suurin miinus pienin RTT viimeisestä 64 otoksesta.
    - **`offsetMs` 0** — N6 antaa kaavan, mutta puolikkaan millisekunnin
      käsittely on toteutuksen valinta (numeroimaton löydös).
    - **`cmds[]`-järjestys** — N8 sanoo "joukko", joten järjestys on vapaa.
      Tässä se on slotti, `atTick`, `id`.
    - **Ankkuri ja istunnon tunniste** ovat sovelluskerrosta, eivät protokollaa.

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

**Miksi juuri ±1 näyte, eikä löysempi tai tiukempi.** Tiedoston poikkeama
tarkasta arvosta ei jää tiedoston loppuun vaan näkyy lukupään sijainnissa, ja
se kasvaa lineaarisesti vaiheen mukana. Tässä silmukassa tiedosto on
−0,4746 näytettä tarkasta:

| Vaihe | Osuus silmukasta | Lukupään poikkeama |
| --- | --- | --- |
| 0 | 0 % | ±0,0000 |
| 3 840 | 25 % | −0,1186 |
| 7 680 | 50 % | −0,2373 |
| 15 360 | 100 % | −0,4746 |

Poikkeama on nolla silmukan alussa ja saavuttaa tiedoston oman poikkeaman sen
lopussa. Siksi ±1 näytteen portti rajaa sijaintivirheen enintään yhteen
näytteeseen — ja täsmälleen silmukan viimeisellä näytteellä. Portti on tasan
yhtä tiukka kuin virhe jonka se päästää läpi, ei löysempi.

Onko materiaali *musiikillisesti* istunnon tempossa, **ei ole** protokollan
tarkistus. Väärässä tempossa oleva materiaali kuulostaa väärältä jokaisessa
asiakkaassa samalla tavalla, joten synkronointi pitää.

## Materiaaliputki käytännössä

!!! warning "Sovelluskerros — ei protokolla"
    Kaikki tässä osiossa on **yhden sovelluksen** ratkaisuja. Määrittely sanoo
    §5:ssä että materiaalin tavujen hankinta on sen ulkopuolella, eikä
    protokolla tiedä mitä materiaali on musiikillisesti — ei rooleja, ei
    instrumentteja, ei genreä. Määrittelyn mukainen toteutus ei ole näille
    mitään velkaa. Ne ovat tässä koska ne näyttävät miltä yksi oikea
    materiaalilähde näyttää.

Mitä putki tuottaa: **Ogg Opus**, 48 000 Hz, stereo, 96 kbit/s VBR,
20 ms kehys. Yksi tiedosto per rooli, 3–6 roolia per kappale, tyypillisesti
16 tahtia 118 BPM:ssä eli 32,54 s ja 330–460 kB per rooli. Materiaalit ovat
silmukoita, eivät kertaotoksia — mikä on protokollan vaatimus (N9): slotin
materiaali silmukoituu `start`ista `stop`iin, eikä kertatoistoa ole olemassa.

Tiiviste lasketaan **valmiista .ogg-tavuista**, ei lähdemateriaalista eikä
ennen enkoodausta, ja `material`-kenttään menee koko `sha256:<hex>` etuliitteineen.

### `lengthTicks` johdetaan tahdeista, ei tiedostosta

Tämä on se kohta jossa materiaali ja protokolla kohtaavat, ja suunta on
odottamaton päin:

```
lengthTicks = tahdit × beatsPerBar × ppq  =  16 × 4 × 960  =  61 440
näytteet    = lengthTicks × 60 × sampleRate / (ppq × bpm)
            = 61 440 × 60 × 48 000 / (960 × 118)
            = 92 160 000 / 59
            = 1 562 033,8983…  →  1 562 034
```

Tiedostoa ei mitata ja pituutta johdeta siitä. Pituus lasketaan tahdeista,
ja **tiedosto leikataan siihen**: putki generoi ylipitkän, tunnistaa tempon,
venyttää enintään 5 %, valitsee musikaalisen leikkauskohdan ja leikkaa
täsmälleen lasketun näytemäärän. Sauma ristiinhäivytetään ylijäävästä osasta,
joten häivytys ei muuta pituutta.

Huomaa mitä tarkka arvo on: `92 160 000 / 59`. Nimittäjä on 59, joten luku
**ei voi olla kokonaisluku** millään tahtimäärällä tässä tempossa. Pyöristys
tehdään vasta lopussa, ja N4:n portti hyväksyy ±1 näytteen. Tässä tapauksessa
poikkeama on 0,1017 näytettä.

### Roolit ja slotit

Protokolla tuntee vain numeroituja slotteja. Rooli–slotti-vastaavuus on
**sovelluksen sopimus**, ei protokollan:

| Slot | 0 | 1 | 2 | 3 | 4 | 5 |
| --- | --- | --- | --- | --- | --- | --- |
| Rooli | DRUMS | BASS | SEQ | CHORD | LEAD | VOX |

Puuttuva rooli on hiljaisuus omassa slotissaan, ei virhe — mikä on tasan se
mitä V3 vaatii.

### Kolme asiaa jotka menivät pieleen, kaikki mitattuja

**Opus ei säilytä huippua.** Enkoodattu tiedosto voi ylittää lähteen todellisen
huipun noin 0,4–0,6 dB. Jos huippu mitataan wavista ennen enkoodausta, soittoon
päätyy raitoja jotka ovat plussalla. Huippu on mitattava **dekoodatusta**
Opuksesta. Tämä on rakenteeltaan sama virhe kuin N14: oikea luku syntyy vasta
muunnoksen jälkeen, ja ennen muunnosta mitattu luku näyttää täysin uskottavalta.

**Granule position ei ole kesto.** Ogg Opuksen viimeinen granule sisältää
pre-skipin, joten oikea kesto on `(viimeinen granule − pre-skip) / 48000`.
Ilman vähennystä jokainen silmukka on muutaman millisekunnin liian pitkä — ja
koska V2 kieltää kierrosten ketjuttamisen, virhe ei kertaudu itse toistossa,
mutta se tekee tiedostosta sellaisen jonka N4:n tarkistus hylkää.

**Kuuden stemmin summa ei ole yksi stemmi.** Kuusi erikseen −14 LUFSiin
normalisoitua raitaa summautui +10,2 dBFS:ään ja leikkasi 1,8 % näytteistä.
Summa normalisoidaan nyt yhdellä yhteisellä vahvistuksella, jolloin raitojen
keskinäiset suhteet säilyvät.

!!! note "Avoin: oikeaa monen asiakkaan istuntoa ei ole vielä ajettu"
    Materiaalipuolelta on mitattu vain yhden dekin ajo. Julkaisu on kolme
    HTTP-kutsua ja soitto lähtee yhdellä, joka lukee kappaleen sovituksen ja
    lähettää `start`-käskyt kunkin osion aloitustahdille — 64 tahtia,
    enimmillään kolme raitaa yhtä aikaa. Mutta montaa asiakasta ei ole ajettu
    yhtä aikaa oikean verkon yli, joten tässä ei ole lukua siitä.

## Musikklubben: yksi sivu, kolme roolia

!!! warning "Sovelluskerros — ei protokolla"
    Tämä on kuvaus yhdestä sovelluksesta, kirjoitettu sen toteuttajan sanoista
    ja tarkistettu koodista 19.9.2026. Määrittely ei vaadi mitään tästä, ja
    tämä ei väitä mitään mitä määrittely ei ole mitannut.

Tavallinen nettiradio lähettää musiikkia: yksi soittaa, muut kuuntelevat.
Klubin omassa tilassa Musikklubben tekee sen toisin päin. **Palvelin ei lähetä
musiikkia lainkaan.** Se lähettää kellon ja käskyjä. Jokainen kuulija on
hakenut materiaalit itse ja soittaa ne itse — ja koska kaikilla on sama kello
ja samat käskyt, jokainen soittaa samaa kohtaa samasta materiaalista samalla
kelloaskeleella.

Miksi näin: klubilla ei soi yksi äänitiedosto vaan kuusi raitaa päällekkäin —
rummut, basso, sekvenssi, soinnut, melodia, laulu — ja neljä lautasta, joista
DJ vaihtaa yhden raidan kerrallaan toiselle. Sellaista ei voi lähettää valmiina
äänenä, koska se miksataan vasta kuulijan päässä. Lähetetään resepti, ja
jokainen kuulija toteuttaa sen.

**Yksi sivu, kolme roolia.** DJ-konsoli, vieraan selain ja palvelimen näkymätön
soittaja ovat sama `index.html`: sama istuntoon liittyvä soitin, sama reseptin
toisto, ei paikallista kellon ohittavaa ääntä. Auto-DJ:n päätökset tehdään
releessä ja lähetetään käskyinä; ainoa DJ-erityinen koodi on konsolin
käyttöliittymä, ei äänipolku. Näkymätön soittaja on kirjaimellisesti sama sivu
Firefoxissa, ja sen ääni napataan Icecastiin → AzuraCastiin tavalliseksi
radiovirraksi. Se ei jäljittele huonetta — *se on huone*, yksi vieras muiden
joukossa, jolla sattuu olemaan mikrofoni. Siksi radio ei voi soida eri tavalla
kuin huone.

**Kaksi tilaa, kytkin konfiguraatiossa.** Vieraan selain liittyy istuntoon ja
vastaanottaa käskyt aina. Se, soittaako se ne itse vai kuunteleeko valmista
virtaa, on yksi tiedosto (`house.json`), jonka rele lukee 20 sekunnin välein.
Kun tiedosto osoittaa virtaan, asiakkaan soitin mykistetään ja tavallinen
`<audio>` soittaa virtaa; kun se on tyhjä, jokainen selain soittaa reseptistä.
Molemmat tilat ovat olleet tuotannossa saman viikon aikana. **Tänään
(19.9.2026) vieras kuulee virran** — mixtape on ollut päällä 18.9. klo 23:19
lähtien.

Tämä ratkaisee, mitä "sama hetki monessa paikassa" tarkoittaa tänään. Virran
tilassa se on totta Icecast-puskurin tarkkuudella, sekunteja. Reseptin tilassa
se on totta kellon tarkkuudella — ja se tarkkuus on juuri se luku, jota
määrittely ei ole vielä mitannut (V1). Kumpaakaan ei tällä sivulla väitetä
millisekunneiksi.

**Kello ei odota ketään.** Jos raita puuttuu, se on hiljaa ja muu jatkaa
ajassa (V3). Kun raita saapuu, se alkaa siitä kohdasta missä sen kuuluu nyt
olla, ei alusta (N10). Kaksi vikaa löytyi vasta oikeiden kuulijoiden kanssa:
liittyjä, joka tiesi milloin materiaali *loppuu* muttei että se *soi* (H37),
ja selain, joka liittyi sekunteja ennen vaihtoa eikä ladannut uutta
materiaalia (H38). Molemmista tuli sääntö, joka koskee nyt jokaista tulevaa
toteutusta. Ja koska näkymätön soittaja on ainoa joka syöttää radiota, sillä
on vahti: jos huone sanoo että musiikkia soi mutta soittaja on hiljaa
puolitoista minuuttia, se käynnistää itsensä uudelleen — ja laskeutuu oikeaan
kohtaan, koska aika ei ole soittajassa vaan kellossa.

**Mitä tämä ei ole.** Kun klubi soittaa mixtapea — kokonaisia kappaleita jotka
eivät istu tahtiruudukkoon — ne soittaa tavallinen radio-ohjelmisto, eikä ääni
kulje Common Timen kautta lainkaan. Common Time on sitä varten, että sama
musiikki syntyy monessa paikassa samalla hetkellä. Kun musiikkia on yksi ja se
syntyy yhdessä paikassa, sitä ei tarvita.

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

Tämän osion kohdat olivat auki kun se kirjoitettiin, ja ne ovat tässä yhä
samasta syystä: esimerkki ei saa päättää asiaa sivun omin päin. Kaikki kolme on
nyt päätetty, ja jokaisen kohdalla lukee milloin.

**Liittyvän asiakkaan sanomajärjestys.** Oli määrittelemättä. Kaksi olemassa olevaa
toteutusta tekee eri tavalla (kohta **H32**): toinen lähettää liittyjälle
`ct.hello` → `ct.session` → `ct.snapshot` eikä `ct.load`-sanomia lainkaan,
toinen lähettää `ct.load`in jokaisesta materiaalista ennen tilannekuvaa. Jälkimmäisen perustelu
on hyvä: ilman `ct.load`ia asiakkaalla ei ole `lengthTicks`iä, eikä se voi
laskea N10:n mukaista sijaintia, jolloin slot vaikenee pysyvästi. Toteutukset
ovat keskenään yhteensopivia: H32 **läpäisee** ajettuna. Kohta ratifioitiin
19.9.2026 ja on nyt **N22**: `ct.session` ensin, ja jokainen tilannekuvan
viittaama materiaali ladattu aiemmin samalla yhteydellä. Ensimmäinen tapa ei
enää ole määrittelyn mukainen.

**Tilannekuvan käskyjen myöhästyminen.** N3 vaatii että myöhästyminen
raportoidaan `late[]`-listalla; N8 sanoo että tilannekuvan käskyt käsitellään
kuin käskyt, ja niiden `atTick` on määritelmän mukaan menneisyydessä. Kumpi
lause voittaa, ei ole tekstissä. Kohta oli **H36**, ratifioitu 18.9.2026 — katso yllä.

**`v`-kentän arvo oli tämän listan kolmas kohta, ja se on nyt päätetty.**
H30 ratkesi 13.9.2026: arvo on `commontime/1` yhteensopivuustunnuksena.
Katso [Tila](status.md) perusteluineen.

Näiden kaltaiset kohdat ovat syy siihen miksi
[kolmas toteutus](contribute.md) on arvokkain asia jonka määrittelylle voi
tehdä.
