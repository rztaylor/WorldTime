# Data tooling boundary

Owns repeatable, development-time generation of bundled static geographic data from credited source extracts.

Does not run in the browser, fetch live user data, calculate current offsets, or own search and UI behavior.

Generated output belongs to `src/data/`; runtime consumers use that data boundary and the shared location types.
