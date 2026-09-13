# Protokolla, joka pakottaa eri asiakassovellukset samaan nuottiin

Common Time on verkkoprotokolla, joka synkronoi valmiiksi ladatun audion
toiston eri laitteilla. Verkossa ei siirretä ääntä tai nuotteja, vaan
ainoastaan muuttumaton ankkuriaika, kelloaskeleet ja toistokäskyt. Järjestelmä
takaa eksaktin synkronoinnin ilman pyöristysvirheitä.

<div data-readout
     data-label-region="Istunnon lukema"
     data-label-tick="Kelloaskel"
     data-label-bar="Tahti"
     data-label-beat="Isku"
     data-label-meter="Tahtilaji"
     data-formula-name="kelloaskel"
     data-formula-now="fysikaalinen_aika_ms"></div>

Tämä sivu laskee oman kelloaskeleensa kiinteästä ankkurista — *13.9.2026 klo
00:00 UTC* — käyttäen kokonaislukuaritmetiikkaa ja alaspäin pyöristävää
jakolaskua, täsmälleen kuten asiakassovelluksenkin on tehtävä (N14). Asiakas
toimii taustalla samalla tavalla, täysin ilman ääntä.

Ajanoton yläraja (katto) on 9 007 199 254 740 991: kelloaskeleen on mahduttava
53 bittiin, koska JSON-muodon luvut käsitellään liukulukuina (N12). Nykyisellä
118 BPM:n tempolla tämä aikaraja riittää katkeamatta noin 151 000 vuodeksi.

## Mistä aloittaa

| | |
| --- | --- |
| [§1 · Verkkoliikenne](spec/crossing.md) | Mitä verkossa kulkee ja mitä ei |
| [§2 · Aika ja kelloaskeleet](spec/time.md) | Yksi ankkuri, muuttumaton tempo, kokonaislukuaika |
| [§4 · Sanomat](spec/messages.md) | Kymmenen sanomaa, viisi operaatiota |
| [§6 · Vaatimukset](spec/obligations.md) | Mitä toteutuksen on saatava aikaan |
| [Tila](status.md) | Mikä on mitattu ja mikä ei |
| [Pyyntö](contribute.md) | Miksi kolmas toteutus on arvokkain asia |
| [Dokumentit](documents.md) | Määrittely ja kaikki sen ympärillä |

!!! warning "Tämä sivu ei ole normatiivinen"
    Missä se eroaa määrittelystä, määrittely voittaa; missä kieliversiot
    eroavat, englanti voittaa. Ei lyhennettä: yksikäsitteinen merkkijono on
    `commontime`, pienellä.

    Mikään tällä sivulla ei ole kiinni missään. Yllä oleva kelloaskel on tämän
    sivun omaa aritmetiikkaa.
