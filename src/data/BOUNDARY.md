# Data boundary

Owns curated city records and the package-backed catalog adapter for countries, IANA timezones, coordinates, aliases, and map-name normalization.

Does not own current-time calculations, search ranking, persistence, app state, map rendering, or network fetching.

UI and pure libraries may read these records. Data may depend only on shared domain types.
