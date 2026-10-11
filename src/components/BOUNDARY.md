# Components boundary

Owns visible product UI: the shell header and search, map, timezone details and cards, and the Compare schedule.

Does not own canonical data, persistence, shared app-state transitions, or pure timezone/search/overlap calculations.

Feature groups may depend on lower data/library/hook/type layers. Components never import the top-level `App` composition.
