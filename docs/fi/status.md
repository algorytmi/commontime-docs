# Missä tämä todella menee

Protokollasivu joka väittää olevansa valmis ei kerro mitään tarkistettavaa.
Tämä on tarkoituksella täsmällinen siitä mikä on mitattu ja mikä ei.

| Määrittely | Toteutuksia | Valinnaisia | Avoimia H-kohtia | Ristiin ajo |
| --- | --- | --- | --- | --- |
| 1.4 | 2 | 0 | 2 | ei ajettu |

Luku 2 on **numeroitujen** avointen kohtien määrä, molemmat numeroitu
19.9.2026 mittaamalla kahden toteutuksen koodia: **H40**, `ct.refuse`-sanoman
`reason`-sanasto — toinen käyttää neljää keksittyä merkkijonoa, toinen vapaata
tekstiä, eikä kumpikaan ole määrittelystä; ja **H41**, mitä `rampTicks`
tarkoittaa `start`- ja `stop`-käskyssä — teksti sanoo että se pätee niihin,
N7 määrittelee rampin arvon saavuttamisena, eikä niillä ole arvoa; toinen
toteutus ohittaa kentän, toinen ramppaa jotain. **Omistaja ratifioi
18.9.2026 yhdeksän kohtaa** — H25, H26, H27, H29, H35, H36, H37, H38 ja H39 —
versioon 1.3, ja **19.9.2026 loput kuusi** — H24, H28, H31, H32, H33 ja H34 —
versioon 1.4. Luku putosi viidestätoista nollaan kahdessa päivässä.

Toinen päätös oli erilainen kuin ensimmäinen, ja ero kannattaa sanoa ääneen.
Ensimmäisen yhdeksästä kohdasta seitsemän oli mitattu yhteneviksi tai löytynyt
ajamalla. Toisen kuudesta **vain H32 oli mitattu**; viisi meni sisään
päätöksellä, ja muutosloki sanoo sen. Päätös ei tee mitatusta: jos jokin
viidestä osoittautuu tuotannossa vääräksi, se on löydös H40– kuten mikä tahansa
muu, eikä ratifiointi suojaa sitä. H34:n liitekorjaus "havaitusta"
"tarvittavaan" on nyt tehty — päätöksellä, ei implisiittisesti, kuten piti.

Viidestä viimeisimmästä löydöksestä kolme löytyi **ajamalla** — kaksi niistä
tuotannossa — ja kaksi **lukemalla korjausta** ennen kuin se ehti tuotantoon.
Molempia tarvitaan. Kirjattuja löydöksiä on
enemmän: toteuttaja kirjaa löydöksen omalla tunnuksellaan (`F7`, `F-B2`) ja
ehdottaa sitä katselmointiin, mutta H-numero syntyy vasta määrittelyssä. Osa
kirjatuista odottaa yhä numeroa. Kumpi luku on oikea riippuu siitä kumpaa
kysytään, ja tällä sivulla se on numeroidut.

## Päätetty

Versio 1.4 on hyväksytty 19.9.2026. Se sulki loput kuusi kohtaa: N20–N23
lisättiin, N11 ja N14 laajenivat, `ct.state` sai kentän `boundMs`, ja V4 sanoo
nyt mihin rajaan se viittaa. Nolla avointa kesti muutaman tunnin: H40 ja H41 numeroitiin samana päivänä.

Versio 1.3 on hyväksytty 18.9.2026. Se sulki yhdeksän kohtaa 1.2a:n jälkeen
nousseesta viidestätoista; kaikki laadinnan aikaiset kaksikymmentäkolme oli
käsitelty jo aiemmin. Määrittelyssä on täsmälleen **yksi
tarkoituksellinen aukko**: toleranssiluku johon V1 ja V4 viittaavat. Se puuttuu
koska sen määräävää mittausta ei ole tehty, ja se suljetaan mittaamalla eikä
keskustelemalla.

## Mitattu

Kelloaskelaritmetiikka läpäisee **47 testiä** ilman riippuvuuksia,
kokonaislukuina läpi koko ketjun: `ct-core` ei tuo yhtään riippuvuutta eikä
koske audioon, verkkoon tai selaimeen. Koko testisarja — `ct-core`,
asiakas, kellopalvelin ja konformanssi yhdessä — on 155 testiä, ja telineen
kalibrointi omat 18 sen lisäksi. Mittausteline lukee tunnetun 10,0000 ms:n viiveen oikein —
mutta vasta PHAT-painotuksen jälkeen: painottamaton ristikorrelaatio luki saman
nauhan arvona **0,9086 ms**, tasan kaksi jaksoa pielessä, korrelaatiokertoimella
0,9969 ja ilman minkäänlaista varoitusta. Oikea moottori pitää p95 0,394 ms
simuloitua kidettä vasten; ketjuttava hajoaa lukuun p95 12,47 ms ja liukuu
4,37 ms tunnissa. Järjestelmäkellon 250 ms:n askel kesken ajon veti
ajautuma-arvion arvoon −2965 ppm kahdeksi minuutiksi, kun oikea luku oli +125.

## Ei mitattu

Jokainen luku joka tarvitsee analogisen lähdön ja tallentimen. Yllä olevat
tarkkuusväitteet on tehty simuloitua kidettä vasten, mikä on kalibrointi eikä
mittaus, eivätkä ne ole toleranssiluku. Mitään ei ole vielä ajettu kahdella
koneella oikean verkon yli kolme tuntia, joka on setin pituus eikä
varmuusmarginaali.

## Korjaus: "estää" oli ennuste eikä mittaus

Avointen kohtien taulukko luki aiemmin yhtä saraketta, **Estää**, ja se oli
virhe. Sana kertoi kaksi eri suuretta yhtenä lukuna:

- **Seuraus jos toteutukset eroavat** on määrittelyn ominaisuus, ja se on
  luettavissa tekstistä.
- **Eroavatko ne** on toteutusten ominaisuus, eikä sitä voi tietää lukemalla —
  se on ajettava.

Näiden tulona esitetty "estää" on luku jota kukaan ei voi tarkistaa. Sarake on
nyt jaettu kahtia, ja mitattu-sarakkeessa lukee vain se mikä on ajettu.

Mitattuna kahta toteutusta vasten **neljä kohtaa, joita pidettiin V4:n
estäjinä, osoittautui yhteneviksi** — mutta kaksi niistä kapeammin kuin
ensin kirjattiin:

| Kohta | Mitä yhtenevyys kattaa |
| --- | --- |
| **H25** `id` | Muodon (ei-negatiivinen kokonaisluku) ja vertailun (numeerinen). **Ei ylärajaa:** toinen vaatii 53 bitin turvarajan, toinen pelkän kokonaisluvun, ja ne eroavat arvosta 2⁵³+2 ylöspäin. Kasvava laskuri ei koskaan pääse sinne, joten eroa ei voi mitata normaalissa ajossa. |
| **H26** `bpm` | Lukutyypin ja lukualueen, ilman varauksia. |
| **H27** `late[]` | Kumulatiivisuuden ja `lateTicks`:n laskennan, ilman varauksia. |
| **H35** `gain` | **Vain `gain`in** nollatason. Rekisterin otsikko puhui parametrin nominaaliarvosta yleisesti, mutta molempien todiste koskee `gain`ia — `param`illa ei ole mielekästä nollaa, koska nimiavaruus on sovelluksen ja arvo voi olla ei-numeerinen (N15). |

Molemmat toteuttajat päätyivät samaan vastaukseen toisistaan tietämättä, ja
H27:ssa samaan **päättelyketjuun**: toinen johti listan tyhjennyksen erikseen
samasta perustelusta. Liittyjän sanomajärjestys (H32) **läpäisee** ajettuna.
**Neljä yhtenevää ratifioitiin 18.9.2026** yllä olevin rajauksin.

Mitattu 1.3:n jälkeen: H26 **oli sitova toiselle toteutukselle**. Vastaus
sanoi 20–300, koodi hyväksyi nollan — ja nollalla kelloaskel ei etene koskaan,
eikä mikään kerro siitä. Yhtenevä vastaus ei ole yhtenevä koodi; siksi
jokaisella kohdalla on kaksi riviä, määrittely ja mitattu.

Katso [Pyyntö](contribute.md) siitä mikä eroavuutta oikeasti ennustaa — se ei
ole seurauksen suuruus.

!!! note "Miksi tällä sivulla lukee H30 eikä H28"
    H-numerot antaa määrittely, mutta toteuttajat eivät näe rekisteriä. Siksi
    kaksi toteuttajaa ehdottaa väistämättä samaa numeroa eri asialle — ja niin
    kävi kahdesti peräkkäin. `v`:n arvoa ehdotettiin numerolla **H28**, mutta
    se on **H30**; `minLeadTicks`:n merkitystä numerolla H29, ja se on **H34**.
    Määrittelyn omat H28 ja H29 ovat eri asioita: `ct.state`n kyvyttömyys
    ilmoittaa sitä rajaa johon §6 viittaa, ja pienin sanomakoko jonka
    toteutuksen on hyväksyttävä.

    Törmäys ei ole kenenkään huolimattomuutta vaan seurausta siitä että
    päätökset kulkevat välikäden kautta. Se on tämän sivun mitattavin esimerkki
    siitä mitä välikäsi maksaa.

## Yhteentoimivuus ei enää odota laitteistoa

Tämä on suunnitelmien tuorein muutos, ja se irrottaa yhteentoimivuusportin
laitteistoportista.

Asiakas joka **kieltäytyy jokaisesta latauksesta** — `ct.refuse`, syy
`missing` — ja vaikenee V3:n mukaan on täysin määrittelyn mukainen. Ristiin ajo sellaista asiakasta
vasten todistaa sen mitä skeema ei voi: että kaksi tilakonetta on yksimielisiä
kädenpuristuksesta, liittymisjärjestyksestä ja tilannekuvan soveltamisesta.

Se ei tarvitse analogista lähtöä, tallenninta eikä yhtään äänitiedostoa — ja se
on ajettavissa samana päivänä kun H30 on päätetty, eli ennen kuin
kaksituloista liitäntää on edes tilattu. Ääni on eri portti ja eri työ.

!!! warning "Ristiin ajo pysähtyi ensimmäiseen sanomaan, ja se oli portin toimintaa"
    Kaksi itsenäistä toteutusta on olemassa. Toinen kirjoitettiin pelkän
    määrittelytekstin varassa, tekijän toimesta joka ei ole nähnyt ensimmäisen
    toteutuksen koodia. Niiden ristiin ajo ei pääse **ensimmäistä sanomaa**
    pidemmälle: N16 vaatii yhteyden sulkemista kun `v`-arvot eroavat, mutta
    määrittely ei koskaan sanonut mikä arvo *on*. Toinen lähetti
    `commontime/1`, toinen `commontime/1.2`, ja yhteys sulkeutui oikein
    molempiin suuntiin.

    Kumpikaan tekijä ei muuttanut arvoaan toisen mukaan. Se kieltäytyminen on
    koko harjoituksen tarkoitus: kahden toteuttajan kesken sovittu arvo on
    yksityinen käytäntö jota kukaan kolmas ei voisi toistaa. Se kuuluu
    määrittelyyn ennen kuin se kuuluu kenenkään lähdetiedostoon.

    Kohta kirjattiin **H30**:ksi, ja se oli pitkään ainoa este mitattuna.

    **H30 on päätetty 13.9.2026.** Arvo on `commontime/1`. Se on
    **yhteensopivuustunnus eikä dokumentin versio** — se muuttuu jos ja vain jos
    lanka rikkoutuu, eivätkä 1.1, 1.2, 1.2a tai 1.3 muuta sitä.
    Vertailu on tavuvertailu, ei jäsennetty versionumero eikä normalisoitu.
    Versio 1.3 on säännön ensimmäinen todiste: se muutti yhdeksän kohtaa
    eikä `v`:n arvoa, koska lanka ei rikkoutunut.
    Eroavuudella yhteys suljetaan koodilla **4001**; yleinen 1000 ei erotu
    normaalista sulkemisesta, jolloin oire olisi "mitään ei tapahdu".

    Perustelu on N16:n omassa logiikassa eikä kummankaan toteuttajan arvossa:
    N16 kieltää versioneuvottelun ja vaatii sulkemista eroavuudella, joten jos
    `v` kantaisi dokumentin version, **jokainen toimituksellinen korjaus
    katkaisisi jokaisen käynnissä olevan yhteyden.** Versio 1.2a oli
    ei-normatiivinen korjaus yhteen perustelulauseeseen. Määrittely on lisäksi
    näyttänyt vastausta joka sivun ylälaidassa sanomatta sitä:
    `commontime/1 · versio 1.2 · hyväksytty 13.9.2026` erottaa tunnuksen ja
    version jo typografisesti.

    **Mitä päätös muutti ja mitä ei.** Yksi sana ei riitä, koska kyse on
    kahdesta eri suureesta — samasta erottelusta jonka H25 ja H26 opettivat,
    nyt sovellettuna niiden oman ratkaisuprosessin tulokseen:

    | | Ristiin ajo |
    | --- | --- |
    | **Määrittely** | ei estä — N16:n aukko on suljettu |
    | **Mitattu** | **ei vielä ajettu** — molemmat toteutukset lähettävät nyt `commontime/1`, mutta ristiin ajoa ei ole suoritettu |

    Päätös muutti ylemmän rivin, ei alempaa. Ohjaustason ristiin ajo on
    määrittelyn puolesta esteetön. B omaksui arvon ja se on mitattu koodista
    18.9.2026; samana päivänä omistaja päätti konformanssisarjan prosessista,
    ja ajo on luvallinen. Alempi rivi muuttuu kun ajo on ajettu, ei ennen.
    Ääni on tämän jälkeenkin eri portti.

    **Päätös on tarkistettu toteutusta vasten**, ei vain kirjattu: arvo
    (myös se ettei se ole 1.1, 1.2 tai 1.2a), tavuvertailu yhdeksällä
    lähiosumalla — välilyönti kummassakin päässä, rivinvaihto, kirjainkoko
    kahdesti, `commontime/1.0` versionumerona luettuna, `commontime/10`,
    `commontime` etuliitteenä ja B:n `commontime/1.2` — sekä sulkukoodi 4001
    ja se että se osuu sovellusalueelle 4000–4999. Kaikki kolme testeinä.
