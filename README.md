# Bractwo Wojowników Kruki — strona wizytówka (GitHub Pages)

Minimalistyczna strona statyczna z:
- sliderem zdjęć na górze,
- feedem Facebook (dominujący na stronie głównej),
- opcjonalnym wąskim paskiem Instagram,
- galeriami członków (folder-per-osoba, opis w Markdown),
- automatycznym generowaniem miniatur i wersji dużych zdjęć.

## Start lokalny

```bash
npm ci
npm run dev
```

## Deploy na GitHub Pages

1. Wrzucasz repo na GitHub.
2. W repo: **Settings → Pages** i jako źródło wybierasz **GitHub Actions**.
3. W pliku `astro.config.mjs` ustaw `site` na właściwy adres:
   - `https://<twoj-username>.github.io/<nazwa-repo>/`

Po pushu na `main` workflow `Deploy to GitHub Pages` zdeployuje stronę.

---

## Jak dodać / zmienić zdjęcia do slidera

Wrzuć pliki do:

```
src/content/hero/
  01.jpg
  02.jpg
  03.jpg
```

- Kolejność = alfabetycznie po nazwie.
- 1 zdjęcie = wygląda jak baner.

## Jak dodać członka

Struktura:

```
src/content/members/<dział>/<NNN-nazwa>/
  bio.md
  photo.jpg
  inne-zdjecie.png
```

Przykład:

```
src/content/members/wojownicy/010-leif/
  bio.md
  photo.jpg
```

Zasady:
- `NNN-...` to kolejność w siatce (rosnąco).
- Przy remisie (ten sam NNN) kolejność jest po nazwie folderu.
- Imię/nazwa na stronie bierze się z folderu (`010-leif` → `Leif`).

**Przeniesienie** między działami = przenosisz folder.

## Instagram — pasek lub brak

W `src/config/site.ts`:
- `showInstagramSidebar: true/false`
- opcjonalnie: `instagramEmbedHtml: '...'` (wklej kod widgetu/iframe dostawcy)

## Facebook

W `src/config/site.ts`:
- `facebookPageUrl: 'https://www.facebook.com/bwkruki'`

---

## Obrazy: miniatury i optymalizacja

Przed buildem uruchamia się automatycznie skrypt:

- `scripts/generate-images.mjs`

Wyniki trafiają do:

- `public/generated/hero/`
- `public/generated/members/...`

