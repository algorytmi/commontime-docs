# Missä tämä todella menee

Protokollasivu joka väittää olevansa valmis ei kerro mitään tarkistettavaa.
Tämä on tarkoituksella täsmällinen siitä mikä on mitattu ja mikä ei.

| Määrittely | Toteutuksia | Valinnaisia | Avoimia H-kohtia | Ristiin ajo |
| --- | --- | --- | --- | --- |
| 1.8 | 2 | 0 | 0 | ei ajettu |

Luku 0 on **numeroitujen** avointen kohtien määrä. **H50** — `param`-arvon
muoto, löytyi 1.7:n tekstistä heti julkaisun jälkeen — hyväksyttiin versioon
1.8 yhdessä `ppq`-avainsanan kanssa. Kolme sitä edeltävää numeroitiin
19.9. myöhään illalla molemmista toteutuksista mitattuina ja **hyväksyttiin
samana yönä versioon 1.7**. **H48**: onko sanoman
kenttäjoukko suljettu — toinen hylkää tuntemattoman kentän, toinen ohittaa;
N20:n lause kentän lisäämisestä on tyhjä jos joukko on suljettu. **H49**:
tilannekuva joka kantaa enemmän kuin N8:n vähimmäismuodon — toinen hylkää
muodoltaan vääränä eikä liity, toinen soveltaa joukon ja saa N8:n voittajan.
Ja **H47**, epämuodostunut
`rampTicks` käskyssä joka ei ota ramppia — toinen toteutus hylkää sanoman
koska kentällä on §4:ssä tyyppi, toinen ohittaa koska teksti sanoo
"ohitettava". Numeroitu 19.9.2026 illalla, molemmat mitattu; ennen kuin toinen
muutti koodiaan, molemmat hylkäsivät. Seitsemän numeroitiin
19.9.2026 mittaamalla kahden toteutuksen koodia, ja **omistaja hyväksyi
samana iltana kuusi niistä — H41–H46 — versioon 1.5.** Ne olivat: **H40**, `ct.refuse`-sanoman
`reason`-sanasto — toinen käyttää neljää keksittyä merkkijonoa, toinen vapaata
tekstiä; **H41**, `rampTicks` `start`- ja `stop`-käskyssä — teksti sanoo että
se pätee niihin, ja *molemmat* toteutukset ovat itsenäisesti tehneet siitä
vaikutuksettoman, eli ero on tekstin ja toteutusten välillä; **H42**,
tasatilanne pienimmässä RTT:ssä — toinen valitsee tuoreimman, toinen
vanhimman, samasta otosjoukosta kaksi eri erotusta; ja **H43**, ei-numeerinen
`param` rampilla — toinen jättää käskyn soveltamatta, toinen soveltaa heti; ja **H44**, mitä
sovellustason virhe yhdessä sanomassa tekee yhteydelle — teksti ei sano, ja
molemmat toteutukset päättivät itsenäisesti saman: yhteys sulkeutuu (toinen
mitattuna, toinen suunniteltuna); **H45**, pariton pienin RTT — toinen kantaa
puolen millisekunnin eksaktina tikkiin asti, toinen pyöristää millisekunnin
ennen tuloa, ja 201 ms:n RTT antaa pysyvän yhden kelloaskeleen eron; ja
**H46**, mitä K7:n "identtinen nimellistila" tarkoittaa rampin keskellä —
kaksi oikeaa kaavaa eroavat viimeisessä bitissä, ja kuultava ramppi ei ole
kummankaan bittitarkka toteutus. Jokainen kuudesta mitattiin molemmilta
toteutuksilta ennen kuin sen lause kirjoitettiin — toisin kuin 1.4:ssä, jossa
viisi kuudesta meni päätöksellä ennen mittausta. **H40 hyväksyttiin
myöhemmin samana iltana versioon 1.6**: N25, kieltäytymisen syy — viisi
tokenia ja vapaa häntä, ei uutta kenttää. **Omistaja ratifioi
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

Versio 1.8 on hyväksytty 19.9.2026 — viides versio samana iltana. Se sulki
H50:n: `param`-arvo on sovelluksen dataa, vastaanottaja hylkää sen vain jos
`name` ei ole merkkijono tai `value`-avain puuttuu, välittäjä välittää sen
muuttamattomana. Ja §2 sanoo nyt avainsanalla että `ppq` ON 960 — molemmat
toteutukset käyttivät ilmoitettua arvoa eikä kumpikaan tarkistanut, joten
kolmas joka olisi kovakoodannut 960:n olisi ollut eri mieltä kellosta
kertoimella kaksi kenenkään huomaamatta. Seuraava on H51.

Versio 1.7 on hyväksytty 19.9.2026 — neljäs versio samana iltana. Se sulki
H47–H49: `rampTicks` on kokonaisluku jokaisessa käskyssä ja sen arvo
ohitetaan kolmessa; N26 (tuntemattomat kentät: avoin vastaanotossa, suljettu
lähetyksessä, N11 nimettynä poikkeuksena); N8: tilannekuvan muoto on
lähettäjän velvoite eikä vastaanottaja hylkää ylimääräistä. Seuraava on H50.

Versio 1.6 on hyväksytty 19.9.2026 — kolmas versio samana iltana. Se sulki
H40:n: N25 nimeää `ct.refuse`-sanoman syyn viidellä tokenilla (`unavailable`,
`format`, `length`, `commensurability`, `protocol`), joiden jälkeen on vapaata
tekstiä jota vastaanottaja ei tulkitse; `ct.load` ennen `ct.session`ia
vastataan `protocol`-syyllä kerran. Avoimia H-kohtia ei ole; seuraava on H47.

Versio 1.5 on hyväksytty 19.9.2026, samana iltana kuin 1.4. Se sulki H41–H46:
N24 lisättiin (sanoma jota ei voi soveltaa), N6, N7 ja N14 laajenivat, K7:n
"identtinen" sai määritelmän, käskyjoukosta poistui ramppi `start`- ja
`stop`-käskyiltä koska molemmat toteutukset olivat jo tehneet niin, ja §7 sai
toisen vektorin parittomalla kiertoajalla. Avoinna on H40.

Versio 1.4 on hyväksytty 19.9.2026. Se sulki loput kuusi kohtaa: N20–N23
lisättiin, N11 ja N14 laajenivat, `ct.state` sai kentän `boundMs`, ja V4 sanoo
nyt mihin rajaan se viittaa. Nolla avointa kesti muutaman tunnin: H40–H46 numeroitiin samana päivänä,
jokainen kahden toteutuksen koodista.

Versio 1.3 on hyväksytty 18.9.2026. Se sulki yhdeksän kohtaa 1.2a:n jälkeen
nousseesta viidestätoista; kaikki laadinnan aikaiset kaksikymmentäkolme oli
käsitelty jo aiemmin. Määrittelyssä on täsmälleen **yksi
tarkoituksellinen aukko**: toleranssiluku johon V1 ja V4 viittaavat. Se puuttuu
koska sen määräävää mittausta ei ole tehty, ja se suljetaan mittaamalla eikä
keskustelemalla.

## Mitattu

**Versio 1.7 on tuotannossa 19.9.2026 klo 23:50** (H47: kaksi muokkausta,
10 minuuttia), **1.6 klo 23:15** (N25: kolme muokkausta, 15 minuuttia) ja
**1.5 klo 22:44**, kolmetoista minuuttia 1.4:n
jälkeen: seitsemän muokkausta, noin 45 minuuttia mittauksineen. N14:n
puolimillisekunnit, N6:n tasatilanne ja N24:n tarkistus ennen mutaatiota
mitattiin asiakkaan omilta lähderiveiltä; hylätty käsky ei enää kuluta
id-numeroa. **Versio 1.4 tuli tuotantoon klo 22:31** — omistajan päätös. `boundMs`
maksoi seitsemän muokkausta ja noin 40 minuuttia mittauksineen. Ensimmäinen
`ct.state` kantaa arvoa 1000 ms (leveä, ei `degraded`, kuten N20 sanoo), sen
jälkeen 1 ms lähiverkosta ja 1–2 ms julkisen HTTPS-proxyn läpi, mitattuna
oikeiden `ct.pong`-kierrosten yli. Rele lukee kentän kun se on luku eikä
koskaan sulje sen puuttumisesta tai väärästä tyypistä — mitattu socketin yli.
N21 tarkistetaan molemmissa päissä. Toinen toteutus on sovitettu 1.4:ään 193
testillä.

Kelloaskelaritmetiikka läpäisee **47 testiä** ilman riippuvuuksia,
kokonaislukuina läpi koko ketjun: `ct-core` ei tuo yhtään riippuvuutta eikä
koske audioon, verkkoon tai selaimeen. Koko testisarja — `ct-core`,
asiakas, kellopalvelin ja konformanssi yhdessä — oli 155 testiä 13.9. ja on 193 testiä 19.9., ja
telineen kalibrointi omat 18 sen lisäksi. Mittausteline lukee tunnetun 10,0000 ms:n viiveen oikein —
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
