# World Time

A fast, account-free timezone comparison tool built around an interactive world map. Inspect a location, explicitly add it to your comparison, compare live local clocks, reorder cards, choose a Home timezone, and find shared working hours. Preferences stay in your browser.

Production URL: [tz.rztaylor.uk](https://tz.rztaylor.uk) (first Cloudflare deployment pending)

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Press <kbd>⌘ K</kbd> or <kbd>Ctrl K</kbd> to search for a city, country, timezone, abbreviation, or UTC offset.

The offline city catalog includes major cities worldwide. Country panels show a short
default list and offer a filter for larger catalogs. City data is derived from
[GeoNames](https://www.geonames.org/) under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/);
the source extract is `cities15000.zip` from the [GeoNames download](https://download.geonames.org/export/dump/).
Regenerate the bundled selection with `node scripts/build-city-catalog.mjs /path/to/cities15000.zip`.

## Validate

```bash
npm run check
npm run test:browser
```

The browser suite requires Playwright Chromium (`npx playwright install chromium`). The product specification lives in [`docs/PRODUCT.md`](docs/PRODUCT.md), with repository policies in [`.agents/facts/`](.agents/facts/).
