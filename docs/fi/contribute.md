# Kirjoita kolmas toteutus

Kaksi toteutusta tuotti **13** ja **9** avointa kohtaa. Neljä niistä on sama
kohta. Se on 18 erillistä löydöstä ja 22 %:n päällekkäisyys.

Noin matala päällekkäisyys on mitattavaa tietoa siitä mitä on jäljellä.
Merkitty–jälleenpyydystys antaa löydettävän populaation kooksi **27–29** kohtaa,
joten **noin kymmenen aukkoa on yhä löytämättä** — ja se on alaraja eikä
pahimman tapauksen arvio: yhteiset katvealueet jäävät populaation ulkopuolelle
kokonaan, ja niin ilmeiset aukot että jokainen löytää ne kasvattavat
päällekkäisyyttä. Molemmat harhat osoittavat samaan suuntaan.

**Mitattu jälkikäteen.** Tuo laskettiin 13.9.2026. Sen jälkeen on numeroitu
yksitoista kohtaa lisää (H36–H46) — seitsemän niistä yhtenä päivänä, 19.9.,
kysymällä molemmilta toteutuksilta samat kysymykset niiden koodista ja
vertaamalla vastauksia. "Noin kymmenen löytämättä" täyttyi kuudessa päivässä
ilman kolmatta toteutusta, ja alaraja oli alaraja: mikään ei sano että
populaatio on nyt tyhjä.

Toteuttaja löytää ne aukot joihin sen oma rakenne osuu. Toinen toteutus lähettää
latauksia liittyvälle asiakkaalle, joten sen tekijä törmäsi liittyjän
sanomajärjestykseen; toinen ei lähetä, joten sen tekijä ei törmännyt. Tästä
syystä hyödyllinen muuttuja on *toteutusten* määrä eikä katselmointikierrosten —
ja tästä syystä **arvokkain asia jonka tälle määrittelylle voi tehdä, on
toteuttaa se kolmannen kerran.**

Mitä erilaisempi rakenne, sitä enemmän se löytää. Mieluiten sellainen jossa *ei*
ole mielivaltaisen tarkkoja kokonaislukuja, koska se osuu N12:een ja N14:ään
suunnasta josta kumpikaan olemassa oleva toteutus ei voi.

## Mikä eroavuutta ennustaa

Tämä on päivän tärkein havainto, ja se on vastoin intuitiota.

Eroavuutta **ei ennusta seurauksen suuruus vaan luontevien lukutapojen määrä.**

Kaksi mitattua tapausta osoittavat sen vastakkaisiin suuntiin:

| | Luontevia lukutapoja | Seuraus jos eroaa | Mitattuna |
| --- | --- | --- | --- |
| **H25** · `id`:n tyyppi | yksi (kokonaisluku) | V4, eli kaikki yhteentoimivuus | **yhtenevä** |
| **H30** · `v`:n arvo | kaksi yhtä luontevaa | yksi merkkijono | **eriävä, pysäytti ajon** |

H25:llä seuraus olisi ollut laaja, mutta kokonaisluku on niin ainoa luonteva
lukutapa että kaksi toteuttajaa osui siihen toisistaan tietämättä. H30:llä
korjaus on yhden merkkijonon mittainen, mutta "protokollan sukupolvi" ja
"dokumentin versio" ovat molemmat yhtä luontevia lukutapoja — ja ristiin ajo
pysähtyi ensimmäiseen sanomaan.

!!! warning "Ja tarkennus, joka maksoi tuotantovian"
    Sääntö ei ole "montako lukutapaa keksin". Toteuttaja harkitsi erästä
    kohtaa, päätteli ettei toisella lukutavalla ole uskottavaa lukijaa, ja
    **hylkäsi löydöksen sillä perusteella.** Toinen toteutus luki sen juuri
    niin, ja seuraus oli tuotantovika (H37).

    **Kaksi uskottavaa lukutapaa ei tarkoita kahta järkevää lukutapaa vaan
    kahta jotka joku oikeasti lukee.** Sen arvioiminen, onko lukutapa
    uskottava, on sama teko kuin aukon ratkaiseminen — ja se epäonnistuu
    samalla tavalla. Kirjaa löydös, älä arvioi lukijaa.

Tästä seuraa käytännön ohje kolmannelle toteuttajalle: **kun törmäät kenttään,
kysy mitkä ovat sen lailliset arvot** — älä pelkästään mikä on sen tyyppi ja
mitä eroavuudesta seuraa. Juuri se kysymys jäi H30:n kohdalla kysymättä.
Määrittely vastasi tyypin ja seurauksen, ja kukaan ei huomannut että arvo jäi
sanomatta.

## Testi joka ei voinut epäonnistua

Tämä projekti on törmännyt samaan virheen muotoon neljä kertaa, eri paikoissa,
ja joka kerta se on näyttänyt eri vialta. Nimi sille kannattaa opetella ennen
kuin kirjoittaa ensimmäisenkään testin: **mittari oli oikeassa siitä mitä se
mittasi, se ei vain mitannut sitä mitä luultiin.**

| Missä | Miltä näytti | Mitä oikeasti tapahtui |
| --- | --- | --- |
| Hylätty testivektori (N5) | Läpäisi | 40 ms:n poikkeama 118 BPM:n tempossa on kaksi prosenttia tahdista, joten korjattu ja korjaamaton vastaus pyöristyivät samaksi luvuksi |
| Ristikorrelaation kerroin | 0,9969 — lähes täydellinen | Vastaus oli täysin väärä: 10,0000 ms luettiin 0,9086 ms:nä, virhe tasan kaksi jaksoa. Kerroin ei havaitse jaksollisuusharhaa lainkaan |
| Viiden minuutin ajo | Käytännössä puhdas, 0,27 ms | Sama toteutus hajoaa kolmessa tunnissa lukuun 12,47 ms. Ketjutusvika ei näy lyhyessä ajossa |
| Tämän sivuston oma tilannekuvaesimerkki | Toimi | Se ei sisällä `stop`-käskyä, ja **toimi siksi** — se näytti asian ratkaistuna vaikkei se ole (H37) |

Kolme ensimmäistä ovat mitattuja lukuja. Neljäs oli tällä sivustolla, ja sen
löysi toteuttaja eikä katselmointi.

Käytännön sääntö kolmannelle toteuttajalle: **läpäisevä testi ei kerro mitään,
ellei se olisi voinut epäonnistua.** Kirjaa jokaisesta testistä myös se väärä
vastaus jonka sen pitäisi hylätä — jos et osaa kirjoittaa sitä, testi ei erottele
mitään. Se on sama vaatimus jonka N5 asettaa testivektoreille, ja se pätee
esimerkkeihin yhtä lailla: esimerkki joka onnistuu vain koska se välttää vaikean
tapauksen on vaarallisempi kuin puuttuva esimerkki.

## Milloin lopettaa

Pysäytyssääntö ei ole löydösten määrä vaan **päällekkäisyys**. Kun uusi
toteutus löytää lähinnä jo tunnettuja kohtia, populaatio alkaa olla tyhjä.

22 % ei ole lähellä sitä. Niin kauan kuin päällekkäisyys on matala, halvin
seuraava siirto on uusi toteutus eikä uusi katselmointikierros.

!!! note "Kolme sääntöä, ja kolmas on se joka ratkaisee"
    **Älä korjaa määrittelyä.** Jos kohta on epäselvä, ristiriitainen tai
    puuttuu, et ratkaise sitä — kirjaat sen ja jatkat sen ympäri, tai pysähdyt.
    Hiljainen ratkaisu on täsmälleen se tapa jolla kaksi toteutusta ajautuu
    erilleen molempien näyttäessä oikeilta.

    **Älä laajenna protokollaa.** Kymmenen sanomaa, viisi operaatiota, yksi
    laajennuspiste. Jos jotain tuntuu puuttuvan, se kuuluu todennäköisesti
    sovelluskerrokseen.

    **Kirjaa jokainen arvaus sillä hetkellä kun teet sen.** Löydös jolla on
    kaksi uskottavaa lukutapaa jotka johtavat eri toteutukseen on arvokkaampi
    kuin toimiva koodi. Oikeaan osunut arvaus jota ei kirjattu, ei erotu
    onnesta.

Sitaatti viittaa versioituun pykälään, ei pykälään: ”§2 / commontime/1”, ei
koskaan ”§2”. Määrittely on samassa versionhallinnassa kuin sitä tarkistavat
testit.
