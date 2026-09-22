# Product facts

- Product name: World Time.
- Source specification: `docs/PRODUCT.md`.
- Audience: people coordinating across locations who want an instant, account-free reference tool.
- Product shape: static single-page browser application; no backend, authentication, profiles, or cloud sync.
- Core workflow: inspect a country/city/timezone or UTC band, explicitly add it to the comparison, compare live local times, reorder or remove cards, choose one Home timezone, and inspect working-hour overlap.
- Comparisons contain 1-10 timezones. Desktop cards use a five-column grid with up to two rows; mobile cards flow onto responsive rows and hide during map-country inspection. Locations are added from search, the map, or details rather than an Add City placeholder card.
- Selection never adds a comparison card implicitly. User-facing offsets are labelled UTC only. Red identifies selected map geography and the current instant in comparisons; comparison tiles use white for work, light grey for other hours, and black for night in both page themes.
- Canonical location identity: IANA timezone identifier; abbreviations are display-only.
- Persistence: versioned browser `localStorage`, key `timezone-map.preferences.v1`.
- Privacy boundary: preferences remain on-device; no IP geolocation or remote timezone API.
- Visual source: `docs/images/design.png`; monochrome, Swiss/editorial, dense but calm, with the map dominant.
- Initial scope excludes accounts, calendar integrations, booking, weather, notifications, map tiles, and backend services.
