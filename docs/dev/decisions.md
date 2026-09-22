# Durable decisions

## Client-only architecture

World Time remains a static browser application. Timezone calculations use bundled browser/library data, geography ships with the build, and preferences stay in versioned localStorage. This preserves instant startup, privacy, and deployment to static hosts.

## Curated location data

The app bundles a capped selection of 950 GeoNames cities alongside curated cities, covering major population centres, national capitals, and prominent regional capitals. The combined catalog stays below 1,000 cities. Countries show a short city list by default and expose the wider selection through search. The source supplies IANA city zones; current offsets remain derived locally. One comparison card is retained per IANA zone, and choosing another city in that zone changes the card's place label. True coordinate-to-IANA boundary lookup is deferred.
