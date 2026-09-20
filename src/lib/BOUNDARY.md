# Library boundary

Owns pure or browser-bound infrastructure for timezone formatting, overlap calculation, search ranking, and versioned preference storage.

Does not own React state, timers, UI rendering, or geographic source records.

App state and feature UI may call this unit. It may depend on types and static data, never on components or app composition.
