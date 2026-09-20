# Changelog

All notable changes follow Keep a Changelog categories.

## Unreleased

### Added

- Initial World Time application with an interactive SVG map, live IANA timezone clocks, local preference persistence, reorderable comparison cards, search, Home timezone controls, and overlap-hours visualization.
- Responsive monochrome interface based on the approved editorial design reference.
- Production hosting through ChatGPT Sites at `tz.rztaylor.chatgpt.site`.
- Full country and IANA timezone search coverage, including UTC-band selection.

### Changed

- Separated map/search/sidebar selection from the explicit **Add to comparison** action.
- Tightened the overall layout and timezone cards, moved the 12/24-hour control into the header, and extended the card strip beneath the sidebar.
- Standardized user-facing offsets on UTC and simplified Home cards to an icon beside the city name.

### Fixed

- Selected countries now use a red fill rather than an outline, including countries outside the original curated city list such as Peru.
- Set the page-level background to prevent white borders on large displays and removed the footer.
