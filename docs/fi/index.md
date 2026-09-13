<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" fill="currentColor"
     fill-rule="evenodd" class="ct-mark" role="img" aria-label="Common Time">
  <title>Common Time</title>
  <path class="ct-mark-after" opacity="0.055" d="M517.22,152.42 710.7,269.2 710.6,345.07 584.29,411.53 583.67,892.65 498.23,937.6 393.3,873.9 393.51,710.66 295,762.09 195.68,813.94 20,707.28 20.53,289.2 235.98,175.85 236.03,131.72 367.8,62.4ZM250.39,134.43 432.83,244.79 582.14,335.02 698.76,273.66 367.73,72.69ZM31.28,293.61 108.06,340.23 331.38,222.73 305.18,206.99 254.31,176.27ZM980,284.67 979.61,594.61 863.24,651.39 717.26,723.75 717.05,885.19 644.33,923.45 595.03,893.52 595.64,418.64 722.42,351.93 722.52,276.15 852.94,207.53ZM730.7,282.02 730.61,356.86 609.21,420.73 651.9,446.65 962.73,283.11 933.2,265.59 853.33,217.5ZM340.83,309.75 385.51,338.25 402.69,350.06 402.03,869.89 497.18,927.66 497.84,412.01 568.83,455.11 568.94,366.64 340.93,228.21ZM28.9,703.29 192.9,802.85 193.01,722.29 103.5,667.95 103.91,348.74 29.41,303.52ZM185.1,392.08 184.8,622.94 191.89,627.7 207.15,637.42 332.71,571.35 393.28,608.12 393.6,353.79 376.96,342.81 332.15,314.71ZM844.04,411.84 844.13,475.43 844.25,519.9 892.69,549.31 892.9,386.14ZM714.95,477.38 714.81,582.35 835.06,519.08 835.19,414.12ZM603.21,889.64 645.01,915.02 645.6,453.2 603.79,427.82ZM714.99,591.9 714.93,645.31 798.89,603.58 890.39,557.89 875.33,548.53 839.35,526.48ZM207.64,646.97 178.98,629.58 113.18,664.2 199.1,716.36 390.31,615.76 333.05,580.99Z"/>
  <g class="ct-mark-beat"><path d="M517.22,152.42 710.7,269.2 710.6,345.07 584.29,411.53 583.67,892.65 498.23,937.6 393.3,873.9 393.51,710.66 295,762.09 195.68,813.94 20,707.28 20.53,289.2 235.98,175.85 236.03,131.72 367.8,62.4ZM250.39,134.43 432.83,244.79 582.14,335.02 698.76,273.66 367.73,72.69ZM31.28,293.61 108.06,340.23 331.38,222.73 305.18,206.99 254.31,176.27ZM980,284.67 979.61,594.61 863.24,651.39 717.26,723.75 717.05,885.19 644.33,923.45 595.03,893.52 595.64,418.64 722.42,351.93 722.52,276.15 852.94,207.53ZM730.7,282.02 730.61,356.86 609.21,420.73 651.9,446.65 962.73,283.11 933.2,265.59 853.33,217.5ZM340.83,309.75 385.51,338.25 402.69,350.06 402.03,869.89 497.18,927.66 497.84,412.01 568.83,455.11 568.94,366.64 340.93,228.21ZM28.9,703.29 192.9,802.85 193.01,722.29 103.5,667.95 103.91,348.74 29.41,303.52ZM185.1,392.08 184.8,622.94 191.89,627.7 207.15,637.42 332.71,571.35 393.28,608.12 393.6,353.79 376.96,342.81 332.15,314.71ZM844.04,411.84 844.13,475.43 844.25,519.9 892.69,549.31 892.9,386.14ZM714.95,477.38 714.81,582.35 835.06,519.08 835.19,414.12ZM603.21,889.64 645.01,915.02 645.6,453.2 603.79,427.82ZM714.99,591.9 714.93,645.31 798.89,603.58 890.39,557.89 875.33,548.53 839.35,526.48ZM207.64,646.97 178.98,629.58 113.18,664.2 199.1,716.36 390.31,615.76 333.05,580.99Z"/></g>
</svg>

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
