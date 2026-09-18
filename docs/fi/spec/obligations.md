# §6 · Vaatimukset määrittävät lopputuloksen – eivät toteutustapaa

Määrittely sanelee ainoastaan sen, miltä äänen on milläkin hetkellä
kuulostettava – ei sitä, miten siihen päästään. Toteutustapa on vapaa: sovellus
voi lisätä näytteitä väliin, hienosäätää soittonopeutta lennosta tai muuttaa
ajoitusta. Jos kaksi eri ohjelmistoa saavuttaa saman lopputuloksen *eri*
menetelmillä, se on vain osoitus protokollan joustavuudesta.

| Tunniste | Vaadittu lopputulos (Mitä ohjelman on tehtävä) |
| --- | --- |
| **V1** | Kaiuttimista kuuluvan äänen on vastattava istunnon senhetkistä kelloaskelta sallitun virhemarginaalin sisällä. Toteutustapa on vapaa. |
| **V2** | Silmukan jokaisen uuden kierroksen on alettava suoraan istunnon yhteisestä ajasta — ei koskaan edellisen kierroksen päättymishetkestä. Kierrosten ketjuttaminen peräkkäin kerryttää aikavirhettä ja on siksi **kielletty**. |
| **V3** | Jos laitteelta puuttuu tarvittava äänitiedosto, kyseisen kanavan (`slot`) **on oltava hiljaa**. Toisto ei saa viivästyä, tiedostoa ei saa korvata muulla, eikä puuttuva tiedosto saa koskaan pysäyttää muiden laitteiden yhteistä istuntoa. |
| **V4** | Jos laite huomaa, ettei se enää pysy yhteisessä ajassa, sen on **katkaistava oma äänensä kokonaan** ja raportoitava `degraded`-tila. Selkeä ja välitön katkeaminen on pakollista, sillä huomaamattomasti ajasta jälkeen laahaava laite pilaa yhteisen musiikin pahemmin kuin kokonaan vaiennut laite. |

!!! note "Äänen tarkkuusraja (Ajan epävarmuuden hallinta)"
    Protokolla ei lupaa absoluuttista, täydellistä kohdistusta palvelimen
    kelloon, koska se on fysiikan lakien vuoksi mahdotonta. Verkkoliikenteen
    menomatka voi kestää eri verran kuin paluumatka (reitin epäsymmetria), mitä
    mikään ohjelma ei voi havaita sisältäpäin. Tämä luo aikajanaan
    väistämättömän virheen, joka on rajattu arvoon **±minRTT / 2** (puolet
    pienimmästä edestakaisesta viiveestä).

    Tämän vuoksi aikaeroa mitattaessa on käytettävä *pienintä* havaittua
    edestakaisviivettä (minRTT). Keskiarvon tai mediaanin käyttö on
    **kielletty**, sillä ne eivät poista verkon jonotuksesta johtuvaa
    epäsymmetriaa. Sovelluksen on raportoitava suoraan `minRttMs`-arvo, eikä se
    saa yrittää esittää mitattua aikaeroa täysin eksaktina.

!!! danger "H38 · V3 määrittelee hiljaisuuden muttei poistumista siitä"
    V3 sanoo mitä tapahtuu hetkellä T, jolloin materiaalia ei ole. **Mikään ei
    sano mitä tapahtuu hetkellä T + n, kun materiaali on saapunut.** Siitä
    seuraa kaksi lukutapaa jotka johtavat eri toteutukseen: joko slot poistuu
    hiljaisuudesta heti materiaalin valmistuttua ja jatkaa N10:n antamasta
    kohdasta, tai se pysyy hiljaa kyseisen `start`in ajan, koska mikään lause ei
    käske aloittamaan ja *"ei saa odottaa"* voidaan lukea myös "älä yritä
    myöhäistä aloitusta".

    Jälkimmäinen tuottaa täsmälleen sen mitä tuotannossa nähtiin: selain joka
    liittyi 2–4 sekuntia ennen levynvaihtoa soitti lähtevän dekin loppuun eikä
    koskaan aloittanut tulevaa — **−91 dBFS koko 128 sekunnin levyn ajan**,
    samalla kun asiakas raportoi itsensä synkatuksi, ei kieltäytynyt mistään ja
    pysyi yhteydessä. Toistettu kolmesti kolmesta.

    Ja saman takana on toinen puute: **määrittely ei velvoita yrittämään
    latausta uudelleen.** Toteutus joka hakee kerran, epäonnistuu eikä yritä
    enää, noudattaa V3:a kirjaimellisesti ja on hiljaa ikuisesti. Kumpi tahansa
    sanamuoto ensimmäiselle kohdalle ei sido mitään sellaista asiakasta vasten,
    joten ne on ratkaistava yhdessä. Kohta on **avoin**.
