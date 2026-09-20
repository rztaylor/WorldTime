# Types boundary

Owns domain contracts shared across architectural units: locations, countries, selected timezone cards, stored preferences, and display settings.

Does not own runtime validation, state transitions, geographic records, formatting, or UI props that are local to one component.

Data, app state, libraries, and UI may depend on this unit. This unit depends on no application code.
