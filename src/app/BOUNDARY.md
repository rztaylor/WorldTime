# Application boundary

Owns top-level workflow composition and the shared timezone preference/state provider.

Does not own geographic records, reusable visual controls, timezone calculations, storage mechanics, or feature-specific rendering.

The app composes feature components and depends on lower layers. No lower layer may import this composition root; components may consume the provider contract.
