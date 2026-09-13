# §2 · Yksi ankkuri, muuttumaton tempo ja tarkat kelloaskeleet

Istunnon aika määritellään yhdellä kiinteällä ajanhetkellä ja kolmella
muuttujalla. Tempo **ei saa** muuttua istunnon aikana. Kaikki protokollassa
liikkuvat aika-arvot ilmoitetaan kelloaskelina. Tahdit ja iskut ovat vain
esitysmuotoja, jotka kuuluvat sovelluksen käyttöliittymään – eivät
verkkoliikenteeseen.

| Kenttä | Merkitys |
| --- | --- |
| `anchorEpochMs` | Kelloaskeleen 0 fysikaalinen ajanhetki (millisekunteina). Muuttumaton. |
| `bpm` | Tempo (neljäsosanuotteja minuutissa). Muuttumaton. |
| `beatsPerBar` | Iskujen määrä tahdissa (oletus 4). Muuttumaton. |
| `ppq` | Kelloaskeleiden määrä neljäsosanuottia kohden. Kiinteä arvo 960. |
| `ticksPerBar` | Johdettu arvo: `ppq × beatsPerBar` (esim. 3840, kun tahtilaji on 4/4). |

Tämä ratkaisu tarjoaa jotain, mitä liukulukuihin tai murtolukuihin perustuva
tahtisijainti ei pysty antamaan: silmukan pituus on aina tasan kokonaisluku.
Esimerkiksi 16 tahtia on aina tasan **61 440 kelloaskelta** riippumatta siitä,
onko tempo 118 vai 120 BPM. Tämän ansiosta aikojen vertailu, tiivistys ja
yhtäsuuruus ovat täysin eksakteja jokaisessa ohjelmistototeutuksessa.

!!! warning "N14 · Ensimmäinen sudenkuoppa: Jakolaskun pyöristys negatiivisilla luvuilla"
    Kelloaskel **on** johdettava alaspäin pyöristävällä jakolaskulla (kohti
    miinus ääretöntä). Sitä **ei saa** pyöristää lähimpään kokonaislukuun, eikä
    sen desimaaleja saa vain katkaista kohti nollaa. Samoin materiaalin
    sijainnin jakojäännöksen (modulo) **on** oltava aina ei-negatiivinen (0 tai
    positiivinen).

    Tämä on kriittinen kohta, sillä useimpien ohjelmointikielten omat
    vakio-operaattorit toimivat tässä väärin negatiivisilla luvuilla.

    Esimerkiksi JavaScriptin `BigInt`-operaatiot palauttavat väärät arvot:

    ```javascript
    // JavaScript BigInt: molemmat toimivat väärin tässä protokollassa
    (-7n) / 2n   // Palauttaa: -3n — katkaisee kohti nollaa (pitäisi olla -4n)
    (-7n) % 2n   // Palauttaa: -1n — negatiivinen jakojäännös (pitäisi olla 1n)
    ```

    Oikea tapa toteuttaa laskenta koodissa:

    ```javascript
    // Oikea alaspäin pyöristävä jakolasku (floor division)
    let t = q / 60000n;
    if (q < 0n && q % 60000n !== 0n) {
      t -= 1n;
    }
    ```

    Kelloaskeleen arvo **voi** hyvin olla negatiivinen. Tämä johtuu siitä, että
    esitys tai ”setti” voidaan aikatauluttaa alkavaksi jo ennen virallista
    ankkurihetkeä. Negatiivinen aika ei ole virhetilanne tai reunatapaus, vaan
    protokollan sisäänrakennettu ominaisuus tapahtumien ajoittamiseen.
