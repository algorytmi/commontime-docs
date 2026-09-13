# Missä tämä todella menee

Protokollasivu joka väittää olevansa valmis ei kerro mitään tarkistettavaa.
Tämä on tarkoituksella täsmällinen siitä mikä on mitattu ja mikä ei.

| Määrittely | Toteutuksia | Valinnaisia | Avoimia kohtia | Ristiin ajo |
| --- | --- | --- | --- | --- |
| 1.2a | 2 | 0 | 12 | estetty |

## Päätetty

Versio 1.2a on hyväksytty. Kaikki kaksikymmentäkolme laadinnan aikana noussutta
katselmointikohtaa on käsitelty. Määrittelyssä on täsmälleen **yksi
tarkoituksellinen aukko**: toleranssiluku johon V1 ja V4 viittaavat. Se puuttuu
koska sen määräävää mittausta ei ole tehty, ja se suljetaan mittaamalla eikä
keskustelemalla.

## Mitattu

Kelloaskelaritmetiikka läpäisee 34 testiä ilman riippuvuuksia, kokonaislukuina
läpi koko ketjun. Mittausteline lukee tunnetun 10,0000 ms:n viiveen oikein —
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

!!! warning "Ristiin ajo on estetty, ja se on portin toimintaa"
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
