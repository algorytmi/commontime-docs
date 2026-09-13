# Tietoja sivustosta

Tämä sivusto ei ole määrittely. Normatiivinen teksti on oma dokumenttinsa, ja
ristiriidassa se voittaa tämän sivuston — katso [Dokumentit](documents.md).

## Teema

Sivusto käyttää **[mkdocs-shadcn](https://github.com/asiffer/mkdocs-shadcn)**
-teemaa, jonka on tehnyt **[@asiffer](https://github.com/asiffer)**. Teema on
MIT-lisensoitu:

> MIT License · Copyright (c) 2026 asiffer

Lisenssi vaatii ilmoituksen kulkevan koodin mukana, ei painettuna joka sivulle.
Se on siis tässä ja lisenssitiedostossa sen sijaan että olisi jokaisen sivun
alalaidassa.

Teemaan on tehty kolme muutosta, kaikki `overrides/`-hakemistossa: kielivalitsin
(teema renderöi ulkoisen nav-rivin osion otsikoksi ilman linkkiä), tämä
alatunniste, ja suomenkielinen kielipaketti — teema toimittaa vain ranskan ja
portugalin.

## Fontit

Teema tuo omat fonttinsa: **Geist**, **Geist Mono** ja **Inter**. Sivusto ei
lataa fontteja mistään muualta.

## Merkki

Common Timen merkki on **13 rengasta ja 92 kärkeä**, yksi polku
`fill-rule="evenodd"`. Yläpalkissa on karsittu kuuden renkaan variantti, koska
täysi merkki on mitattu sameaksi 32 pikselissä ja lukukelvottomaksi 16:ssa.

Merkki sykkii neljä impulssia tahdissa **118 BPM**:n tempossa — sama kuin
määrittelyn kanonisessa vektorissa — eli tahti on `4 × 60000 / 118 = 2033,898`
millisekuntia. Vaihe johdetaan yhteisestä ankkurista, koska ilman sitä jokaisen
lukijan merkki sykkisi omassa vaiheessaan; se olisi osuva iva sivustolla, jonka
koko aihe on saada itsenäiset asiakkaat samaan aikaan.

Geometria ja rytmi ovat identiteettiä eivätkä protokollaa. Määrittely ei ota
kantaa merkkiin.

## Elävä kelloaskel

Etusivun lukema laskee oman kelloaskeleensa kiinteästä ankkurista samalla
kaavalla jota asiakkaankin on käytettävä: kokonaislukuaritmetiikkaa
(`BigInt`) ja **alaspäin pyöristävää jakolaskua**, ei liukulukuja. N14 ei ole
muotoseikka, ja sivu noudattaa sitä itse.

`prefers-reduced-motion` pysäyttää sekä lukeman että merkin.

## Haku

Hakuindeksi on lunr, ja suomenkielinen versio käyttää suomen katkaisusääntöjä.
Kumpikin kieli indeksoidaan erikseen, koska sivustoa käännetään kaksi kertaa —
yksi käännös kieltä kohden.
