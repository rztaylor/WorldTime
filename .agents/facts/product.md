# Product facts

- Product name: World Time.
- Source specification: `docs/PRODUCT.md`.
- Audience: people coordinating across locations who want an instant, account-free reference tool.
- Product shape: static single-page browser application; no backend, authentication, profiles, or cloud sync.
- Core workflow: select a country/city/timezone, compare live local times, reorder or remove cards, choose one Home timezone, and inspect working-hour overlap.
- Canonical location identity: IANA timezone identifier; abbreviations are display-only.
- Persistence: versioned browser `localStorage`, key `timezone-map.preferences.v1`.
- Privacy boundary: preferences remain on-device; no IP geolocation or remote timezone API.
- Visual source: `docs/images/design.png`; monochrome, Swiss/editorial, dense but calm, with the map dominant.
- Initial scope excludes accounts, calendar integrations, booking, weather, notifications, map tiles, and backend services.
