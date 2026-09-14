# Määrittely ja kaikki sen ympärillä

Normatiivinen teksti on yksi dokumentti. Muut ovat olemassa jotta normatiivisen
tekstin ei tarvitse perustella itseään, puolustella itseään eikä pitää
päiväkirjaa.

!!! note "Dokumentteja ei toistaiseksi jaeta julkisesti"
    Ne ovat olemassa ja ne on lueteltu alla versioineen, mutta niitä ei ole
    julkaistu. **Pyydä pääsyä**
    [avaamalla issue](https://github.com/algorytmi/commontime-docs/issues) —
    kerro mitä olet tekemässä, niin tiedän mitä sinun kannattaa lukea.

    Syy ei ole salailu vaan mittaus. Toinen riippumaton toteutus kirjoitetaan
    parhaillaan **pelkän määrittelytekstin varassa**, eikä sen tekijä näe
    ensimmäisen toteutuksen koodia, perusteluja eikä katselmointirekisteriä.
    Ristiin ajo näiden kahden välillä on ainoa testi joka kertoo onko Common
    Time protokolla vai kirjasto, ja se mittaa nimenomaan sitä mitä pelkästä
    tekstistä saa irti. Perustelut sisältävät ratkaisut proosana — ja jos
    toteuttaja lukee ne, hän toteuttaa tulkinnan eikä tekstiä.

    Määrittely on se dokumentti jonka toteuttaja tarvitsee, ja sen saa
    pyytämällä. Loput avautuvat kun ristiin ajo on ajettu.

| Dokumentti | Kuvaus | Versio |
| --- | --- | --- |
| Common Time Core | Normatiivinen määrittely. Määräävä versio. | `1.2a` |
| Common Time Core | Suomenkielinen versio. Työversio; englanti voittaa ristiriidassa. | `1.2a` |
| Perustelut | Neljä kieltäytymistä, kahdeksan mitattua päätöstä, kahdeksantoista hylättyä vaihtoehtoa. | `1` |
| Toteutussuunnitelma | Kuusi vaihetta, joista viisi mittauksia. Jokaisella portti. | `1e` |
| Konformanssisuunnitelma | Testisarja määrittelyn auditointina. Jokainen testi sitoo pykälään. | `1d` |
| Työnjako ja avoimet kohdat | Kuka pitää kynää mistä, ja kaksitoista päätöstä odottavaa kohtaa. | `2b` |
| Ennakkotapaukset | Noin viisikymmentäviisi verrattavaa järjestelmää, ja mitä kukin tekee sen sijaan. | `—` |
| Synty | Ei-tekninen, suusanallinen. Kahdeksan lukua ja neljä kieltäytymistä. | `—` |
| Merkki | Kolmetoista rengasta, 92 kärkeä, vaihelukittu yhteiseen ankkuriin. | `—` |

## Sovelluskerros — ei protokolla

Common Time on olemassa koska jokin tarvitsi sitä. Nämä dokumentit kuvaavat sen
jonkin, ja ne **eivät** ole osa määrittelyä — määrittelyn mukainen toteutus ei
ole niille mitään velkaa.

| Dokumentti | Kuvaus | Versio |
| --- | --- | --- |
| Musikklubben | Virtuaaliyökerho jota varten protokolla kirjoitettiin. | `MVP` |
| Materiaaliputki | Miten generoitu ääni muuttuu materiaaliksi jota protokolla voi osoittaa. | `1a` |
| Operaattorin konsoli | Havainnollistus nelidekkisestä ohjaimesta. Ei minkään määrittely. | `—` |
