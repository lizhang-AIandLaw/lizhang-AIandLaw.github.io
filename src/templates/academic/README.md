# Academic Light

An alternate presentation layer for the existing Markdown/JSON content.
Enable it with `"template": "academic"` in `content/site.json`.
Set `"template": "terminal"` to return to the original template.

## Content

- Continue editing `content/about.md`, `content/publications/*.md`, and the existing JSON files.
- `site.json` still controls section order, selected publication IDs, component overrides, and feature flags.
- The hero slot appears in the desktop sidebar; the footer appears below the page.
- The academic preview uses English and has no language toggle. Existing Chinese content remains available to the original template.
- Publications use `isFirstAuthor` / `isCoFirst`, `specialBadges`, `venue`, and `keywords` for filters. Selected papers use `selectedPublicationIds`; no separate content list is required.
- Publication filters persist in the URL. Light/dark/system appearance is saved locally in the browser.
- About content retains its Markdown links, paragraphs, and emphasis.

## Design

Original implementation inspired by [Minimal Light](https://minimal-light-theme.yliu.me/) (two columns and whitespace), [al-folio](https://alshedivat.github.io/al-folio/) (bibliography entries), and [Xuhui Zhou's homepage](https://xuhuiz.com/publications) (publication filtering and understated interactions).

Light appearance uses [Pitt Royal Blue `#003594`](https://www.brand.pitt.edu/brand-elements/color-palettes), with lighter blue accents and no gold. Typography uses a system sans-serif stack throughout. Dark appearance uses a lighter blue for readable links.

## Local preview

```sh
npm run dev -- --host 127.0.0.1 --port 5174
```

Open `http://127.0.0.1:5174/`. `npm run build` checks TypeScript and builds the site.
