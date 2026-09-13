# §1 · Mitä verkkoliikenteessä siirretään?

## Verkossa kulkee vain minimaalista ohjaustietoa

- **Synkronointiparametrit:** Aloitushetki (`anchorEpochMs`), tempo (`bpm`),
  tahdin iskut (`beatsPerBar`) ja kellon tarkkuus (`ppq`).
- **Aikaleimat:** Matemaattisen tarkat kelloaskeleet (kokonaislukuarvot).
- **Toistokomennot ja parametrit:** Käynnistys (`start`), pysäytys (`stop`),
  äänenvoimakkuus (`gain`), muut parametrit (`param`) sekä soitettava
  materiaali (`material`).
- **Tunnisteet:** Materiaalin yksilöivä SHA-256-tiiviste.
- **Diagnostiikka:** Järjestelmän telemetriatiedot.

## Verkossa ei koskaan siirretä

- Äänisignaalia (audiota) tai nuottidataa (kuten MIDIä).
- Tekoälyprompteja, mallitunnisteita, kehotuksia tai ehdotuksia.
- Käyttöoikeustietoja, käyttäjän identiteettiä tai sovelluksen yleistä tilaa.

!!! note "Miksi materiaalina käytetään valmiiksi renderoitua ääntä eikä nuottisekvenssejä?"
    Jos kaksi eri sovellusta soittaisi saman nuottisekvenssin, ne tuottaisivat
    erilaisen äänen eri instrumenteilla. Täydellisen yhtenäisyyden takaamiseksi
    materiaalin on oltava valmiiksi renderoitua audiota, johon viitataan
    yksikäsitteisellä sisältötiivisteellä (koodilla).

    Protokolla kuljettaa vain tiedon siitä, mitä soitetaan (identiteetti) ja
    milloin soitetaan (aika). Se, miten materiaali on alun perin tuotettu,
    venytetty, uudelleennäytteistetty tai generoitu, jätetään täysin
    asiakassovelluksen vastuulle.
