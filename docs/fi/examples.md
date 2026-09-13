# Esimerkit

Määrittely kertoo mikä on totta. Tämä sivu näyttää miltä se näyttää luvuissa.

Kaikki alla olevat luvut on laskettu samalla aritmetiikalla jota sivun oma
kelloaskellukema käyttää — kokonaislukuina, alaspäin pyöristävällä
jakolaskulla. Voit tarkistaa ne itse.

## Sama silmukka, eri tempo

Tämä on se ominaisuus jota murtolukuinen tahtisijainti ei anna. Silmukan
pituus **kelloaskelina** ei riipu tempoista lainkaan; vain sen kesto
sekunteina riippuu.

| Tempo | 16 tahtia kelloaskelina | Kesto |
| --- | --- | --- |
| 100 BPM | 61 440 | 38,4000 s |
| 118 BPM | 61 440 | 32,5424 s |
| 120 BPM | 61 440 | 32,0000 s |
| 140 BPM | 61 440 | 27,4286 s |

Luku `61 440` on tasan `16 × ppq × beatsPerBar` = `16 × 960 × 4`. Se on
kokonaisluku jokaisessa tempossa, jokaisessa toteutuksessa, ilman
pyöristystä — ja juuri siksi kahden silmukan yhtäsuuruuden voi tarkistaa
vertaamalla kahta kokonaislukua.

## Tahdista kelloaskeleeksi

Istunnon tahtilaji on 4/4 ja `ppq` on 960, joten yksi tahti on
`ticksPerBar = 960 × 4 = 3 840` kelloaskelta.

```
tahti 25, isku 1   =  25 × 3 840  =  96 000 kelloaskelta
```

Kun istunnon ankkuri on **13.9.2026 klo 00:00:00 UTC** ja tempo 118 BPM,
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
useimpien muiden kielten — katkaisee kohti nollaa ja antaa **−1**. Kaksi
toteutusta, joista toinen katkaisee ja toinen pyöristää alaspäin, eroavat
yhden kelloaskeleen verran heti ensimmäisellä negatiivisella arvolla, eikä
kumpikaan huomaa mitään.

Muut kaksi riviä eivät paljasta virhettä: niissä jakojäännös sattuu olemaan
nolla, jolloin katkaisu ja alaspäin pyöristäminen antavat saman vastauksen.
Siksi vika **ei** näy testissä joka kokeilee pyöreitä lukuja.

Katso [§2 · Aika ja kelloaskeleet](spec/time.md) siitä miten laskenta
kirjoitetaan oikein.
