# Components boundary

Owns visible product UI: the shell header, map, timezone details and cards, overlap visualization, and shared accessible controls.

Does not own canonical data, persistence, shared app-state transitions, or pure timezone/search/overlap calculations.

Feature groups may depend on shared controls and lower data/library/type layers. Components never import the top-level `App` composition.
