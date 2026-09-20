# World Time

A fast, account-free timezone comparison tool built around an interactive world map. Select a location, compare live local clocks, reorder cards, choose a Home timezone, and find shared working hours. Preferences stay in your browser.

Live site: [tz.rztaylor.chatgpt.site](https://tz.rztaylor.chatgpt.site)

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite. Press <kbd>⌘ K</kbd> or <kbd>Ctrl K</kbd> to search for a city, country, timezone, abbreviation, or UTC offset.

## Validate

```bash
npm run check
npm run test:browser
```

The browser suite requires Playwright Chromium (`npx playwright install chromium`). The product specification lives in [`docs/PRODUCT.md`](docs/PRODUCT.md), with repository policies in [`.agents/facts/`](.agents/facts/).
