# Changelog

All notable changes follow Keep a Changelog categories.

## Unreleased

### Added

- Initial World Time application with an interactive SVG map, live IANA timezone clocks, local preference persistence, reorderable comparison cards, search, Home timezone controls, and overlap-hours visualization.
- Responsive monochrome interface based on the approved editorial design reference.
- Production hosting through ChatGPT Sites at `tz.rztaylor.chatgpt.site`.
- Full country and IANA timezone search coverage, including UTC-band selection.
- Searchable multi-timezone country lists using IANA names, seasonal abbreviations, and long timezone names.
- Static capital-city fallbacks so every country has a city available for inspection.

### Changed

- Distinguished current civil offsets from geographic longitude guides, including clearer DST and standard-offset details.
- Separated map/search/sidebar selection from the explicit **Add to comparison** action.
- Tightened the overall layout and timezone cards, moved the 12/24-hour control into the header, and placed the compact card strip beneath the map while the sidebar spans the full workspace height.
- Standardized user-facing offsets on UTC and simplified Home cards to an icon beside the city name.
- Updated the map annotation to show the country prominently with the selected city beneath it.
- Kept the desktop map/sidebar region at a stable height with internal sidebar scrolling and a concise common-timezone list.
- Removed redundant card-strip guidance and aligned each card's UTC offset beside its timezone name.

### Fixed

- Country drilldowns now return to their originating UTC-offset list, and country details no longer repeat the country name in a redundant section.
- Kept UTC offset headings and vertical bands aligned with the map while panning and zooming.
- UTC-band selection now shades and lists every country currently sharing the offset instead of selecting an arbitrary country.
- Removed the inactive country-detail chevron; offset country rows retain chevrons and drill into the selected country.
- Selected countries now use a red fill rather than an outline, including countries outside the original curated city list such as Peru.
- Prevented the selected-country label from blocking clicks on neighbouring countries and removed the residual SVG focus border.
- Capped and centred timezone and Add City cards within the comparison area.
- Set the page-level background to prevent white borders on large displays and removed the footer.
