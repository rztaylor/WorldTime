# Durable decisions

## Client-only architecture

World Time remains a static browser application. Timezone calculations use bundled browser/library data, geography ships with the build, and preferences stay in versioned localStorage. This preserves instant startup, privacy, and deployment to static hosts.

## Curated location data

The first release uses a curated set of globally useful cities and country-to-timezone mappings. Multi-zone countries expose representative city/timezone choices instead of pretending a country has one zone. True coordinate-to-IANA boundary lookup is deferred.
