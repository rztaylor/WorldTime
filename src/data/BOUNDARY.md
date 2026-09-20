# Data boundary

Owns the curated, static catalog of cities, countries, IANA timezones, coordinates, and search aliases shipped with the app.

Does not own current-time calculations, search ranking, persistence, app state, map rendering, or network fetching.

UI and pure libraries may read these records. Data may depend only on shared domain types.
