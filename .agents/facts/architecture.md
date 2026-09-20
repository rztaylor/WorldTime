# Architecture facts

- `src/app/` composes the single-page workflow and owns shared application state.
- `src/components/` owns visible feature UI grouped by header, map, timezone, overlap, and shared primitives.
- `src/data/` owns curated countries, cities, and timezone metadata; components must not embed geographic records.
- `src/hooks/` owns reusable browser lifecycle behavior such as the central clock.
- `src/lib/` owns pure search, storage, overlap, and timezone helpers.
- `src/types/` owns cross-unit domain contracts. `src/styles/` owns global tokens and responsive composition.
- Dependencies flow from app/feature UI toward types, data, hooks, and lib; lower layers do not import app or feature components.
- Every hand-written architectural unit uses `BOUNDARY.md`; generated, vendored, and package-provided map data are exempt.
- Boundary documents should remain under 2 KiB. Validation: `npm run check`.
