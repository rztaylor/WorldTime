# Timezone Map Website

## 1. Product Summary

Build a fast, client-side timezone comparison website centred around an interactive world map.

The visual style should follow the mock-up in docs/images/design.png:

* strongly monochrome
* Swiss / editorial design influence
* large, bold typography
* strict grid layout
* mostly white, black and neutral grey
* minimal decoration
* very clear information hierarchy
* map as the dominant interface element
* dense information without feeling cluttered

The application should require no account and no backend for its core functionality.

User preferences should be stored locally in the browser.

The main workflow is:

1. User opens the site.
2. Their saved timezone configuration is restored.
3. A world map occupies most of the screen.
4. Timezones are shown as subtle vertical bands.
5. Clicking a country, city, or timezone selects it for inspection.
6. Clicking a UTC band highlights every country currently sharing that offset and lists those countries in the left panel.
7. Choosing a country from an offset list drills into that country's timezone details.
8. That drilldown provides a contextual back action returning to the originating UTC offset list.
9. The user explicitly chooses **Add to comparison** before a timezone card is created.
10. Selected timezone cards may be dragged into a different order.
11. Any timezone can be removed.
12. One timezone can be designated as Home.
13. The Home timezone is visually distinctive.
14. The user can compare overlapping working hours across all selected timezones.

Selection and comparison are intentionally separate actions. Map clicks, search results,
sidebar choices, and UTC-band headings update the current details without changing the
saved comparison. The selected country uses the product's sole accent colour, red;
other UI states remain restrained. User-facing offsets are always labelled `UTC`, never
`GMT`.

No login, cloud synchronisation or account creation is required.

---

# 2. Technology Stack

Use:

* Vite
* React
* TypeScript
* Tailwind CSS
* localStorage for persistence

Recommended supporting libraries:

```text
react
react-dom
typescript
tailwindcss

@dnd-kit/core
@dnd-kit/sortable
@dnd-kit/utilities

luxon

lucide-react
```

For the map, prefer SVG rather than a canvas or heavyweight map framework.

Recommended options:

```text
react-simple-maps
```

or:

```text
d3-geo
topojson-client
```

Preferred implementation:

```text
react-simple-maps
```

because the application does not require streets, satellite imagery, zoom tiles or geographic navigation.

Avoid Leaflet, Mapbox and Google Maps unless a future requirement genuinely needs them.

---

# 3. Core Design Principles

## 3.1 Monochrome

The site should use almost no colour.

Primary palette:

```text
Background:        #FFFFFF
Secondary BG:      #F5F5F4
Panel BG:          #FAFAF9

Primary text:      #111111
Secondary text:    #525252
Muted text:        #737373

Borders:           #E5E5E5
Strong borders:    #171717

Map inactive:      #D6D6D4
Map secondary:     #9E9E9B
Map selected:      #171717
```

Avoid gradients except where subtle opacity variation is needed for timezone bands.

Red remains the sole interaction accent and is reserved for selected map geography.
The comparison visualization adds subtle functional colour: muted purple for nighttime,
warm yellow for working hours, and restrained blue for the hours between. Light and dark
themes adjust intensity and text contrast while preserving those meanings.

---

# 4. Typography

The design should feel typographic rather than ornamental.

Recommended font pairing:

```text
Sans:
Inter

Optional display / editorial serif:
Instrument Serif
or
Libre Baskerville
```

However, the second mock-up works well using primarily a bold grotesque sans-serif.

Suggested hierarchy:

```text
Site title:
24-28px
font-black
tracking-tight

Timezone offset:
64-76px desktop
font-black
tracking-tight

Card time:
34-42px
font-bold

Section titles:
14-16px
font-bold
uppercase
tracking-wide

Normal UI text:
14px

Supporting metadata:
12-13px
text-neutral-500
```

Use tabular numbers for clocks:

```css
font-variant-numeric: tabular-nums;
```

This prevents clocks from shifting width as digits change.

---

# 5. Overall Desktop Layout

The main application should approximately follow:

```text
┌──────────────────────────────────────────────────────────────┐
│ HEADER                                                       │
├───────────────┬──────────────────────────────────────────────┤
│               │                                              │
│ LEFT PANEL    │                WORLD MAP                     │
│               │                                              │
│  UTC +1       │                                              │
│               │                                              │
│ countries     │                                              │
│ cities        │                                              │
│               │                                              │
├───────────────┴──────────────────────────────────────────────┤
│ SELECTED TIMEZONES                                           │
│ [HOME] [London] [Berlin] [Tokyo] [Sydney] [+ Add]           │
├──────────────────────────────────────────────────────────────┤
│ OVERLAP HOURS                                                │
├──────────────────────────────────────────────────────────────┤
│ FOOTER                                                       │
└──────────────────────────────────────────────────────────────┘
```

Recommended page width:

```text
max-width: 1600px
```

but allow the map to use almost the entire viewport on large monitors.

Main grid:

```css
grid-template-columns: 290px minmax(0, 1fr);
```

For very wide screens:

```text
Left panel: 300-330px
Map: everything else
```

---

# 6. Header

Height:

```text
72-80px
```

Contents, left to right:

```text
WORLD TIME logo

Map
Timezones
Compare
Tools
About

Search field

Theme switch

Set Home Timezone
```

The header should feel compact rather than app-like.

Example structure:

```tsx
<header>
  <Brand />

  <PrimaryNavigation />

  <div className="ml-auto flex items-center gap-3">
    <GlobalSearch />
    <ThemeToggle />
    <SetHomeButton />
  </div>
</header>
```

The first version only needs the Map page.

Other links may be placeholders or hidden until functionality exists.

---

# 7. Global Search

Search should accept:

```text
country
city
timezone
timezone abbreviation
UTC offset
```

Examples:

```text
London
Tokyo
Japan
America/New_York
UTC+5
UTC-8
PST
```

Search should appear in the header.

Desktop width:

```text
300-360px
```

Keyboard shortcut:

```text
Ctrl/Cmd + K
```

Pressing the shortcut focuses the search.

Search results should be grouped:

```text
Cities

London
London, Canada
London, Kentucky

Countries

United Kingdom

Timezones

Europe/London
```

Selecting a result should:

1. highlight the location on the map
2. open its timezone details in the left panel
3. expose an explicit **Add to comparison** action without adding it automatically

---

# 8. Left Timezone Panel

The left panel changes depending on the current map selection.

Example:

```text
← All Timezones

UTC+1

Central European Time
CET

Standard offset · GMT+1

☀ Some locations currently observe
  daylight saving time

COVERED COUNTRIES (29)

Austria
Belgium
Croatia
Czechia
Denmark
France
Germany >
Italy
Netherlands
Norway
...

Show all

MAJOR CITIES

Berlin       UTC+1
Paris        UTC+1
Rome         UTC+1
Madrid       UTC+1
Vienna       UTC+1

Show more cities
```

Use extremely strong typography for the offset.

Example:

```tsx
<div className="text-7xl font-black tracking-tighter">
  UTC+1
</div>
```

Clicking a country or city in this panel should update the map selection.

---

# 9. World Map

The map is the visual centre of the application.

It should show:

* country boundaries
* timezone bands
* selected country
* countries sharing the selected timezone
* UTC offset labels
* optional city marker

The initial map should show longitude-aligned timezone bands approximately as:

```text
-12 -11 -10 ... UTC +1 +2 ... +12
```

These bands are visual guidance rather than authoritative timezone boundaries.
Their labels and vertical grid must share the map's horizontal pan and zoom transform,
so the geography cannot move out of alignment with the displayed offsets.
The offset controls are explicitly labelled as current offsets including daylight saving.
The longitude grid uses lines only—not shaded columns—so it reads as geographic guidance
rather than a claim that countries physically inside a column use that civil offset.

Actual timezone assignment must come from timezone data.

Timezone boundaries do not exactly follow longitude.

Therefore separate:

```text
visual UTC bands

from

real IANA timezone geography
```

---

# 10. Map Visual States

Use three main country states.

## Normal

```text
fill: neutral-300
```

## Same timezone

```text
fill: neutral-500
```

## Selected country

```text
fill: red
```

Hover:

```text
slightly darker
cursor-pointer
```

Selected country may display a floating label:

```text
● Germany
  Berlin
```

The country is the prominent first line and the city is a smaller, lower-contrast second line.
Avoid oversized popup balloons.
Do not draw a focus rectangle or selection border around a country; the red fill is the
complete visual selection treatment. Labels and markers must not intercept country clicks.

---

# 11. Map Controls

Place controls vertically in the upper-right or right-centre.

```text
+
-
◎
```

Functions:

```text
zoom in
zoom out
reset map
```

Maximum zoom should be deliberately limited.

This is not a navigation map.

Recommended:

```text
1x to 4x
```

---

# 12. Timezone Cards

Cards appear below the map.

Example:

```text
┌────────────────────┐
│ ⌂ New York      ×  │
│                    │
│ 10:24 AM           │
│ America/New_York   │
│ UTC-4              │
└────────────────────┘
```

Cards should remain short and compact. Desktop displays up to five equal-width cards per row,
with a maximum of ten selected timezones forming two rows. Mobile retains horizontally
scrollable compact cards.
The AM/PM suffix is smaller and lower contrast than the clock digits. The UTC offset shares
the timezone-name row and is aligned to its right edge. Cards occupy the space beneath the map,
while the sidebar continues alongside the cards.

The mobile row should scroll horizontally when necessary.

Use:

```css
overflow-x-auto
```

but retain drag-and-drop behaviour.

The interface does not need explanatory “drag to reorder” or persistence copy above the cards;
the drag handles communicate reordering and browser persistence is implicit.

---

# 13. Home Timezone

Exactly one timezone may be Home.

The Home card should be visually inverted.

Normal card:

```text
white background
black text
grey border
```

Home card:

```text
black background
white text
```

Example:

```text
⌂ New York

10:24 AM

America/New_York  UTC-4
```

Clicking:

```text
Set Home
```

on another timezone reassigns Home.

Home should not be tied to the browser's detected timezone.

The user controls it.

---

# 14. Timezone Card Behaviour

Each card should support:

```text
drag to reorder
remove
set as Home
```

Optional context menu:

```text
Set as Home
Remove
Copy local time
Copy timezone name
```

Use `@dnd-kit` for drag behaviour.

Avoid native HTML5 drag-and-drop because touch behaviour is inconsistent.

---

# 16. Selected Timezone State

Use the IANA timezone identifier as the canonical identity.

Do not use abbreviations.

The comparison contains at least one and at most ten timezones. Once ten are selected,
additional locations remain inspectable but the Add to comparison action is disabled until
one of the existing cards is removed. New locations are added through search, the map, or
the timezone details panel; there is no placeholder Add City card in the card grid.

Correct:

```text
Europe/London
America/New_York
Asia/Tokyo
Australia/Sydney
```

Incorrect:

```text
BST
EST
CST
```

because abbreviations can be ambiguous.

Suggested TypeScript model:

```ts
export interface SelectedTimezone {
  id: string;
  timezone: string;

  city: string;
  country: string;

  latitude?: number;
  longitude?: number;

  isHome: boolean;

  sortOrder: number;
}
```

Example:

```ts
{
  id: "london",
  timezone: "Europe/London",
  city: "London",
  country: "United Kingdom",
  latitude: 51.5072,
  longitude: -0.1276,
  isHome: true,
  sortOrder: 0
}
```

---

# 17. Current Time Calculation

Use `luxon`.

Example:

```ts
DateTime.now()
  .setZone("Europe/London")
```

Display:

```text
3:24 PM
```

or:

```text
15:24
```

according to user preference.

Also display:

```text
BST
UTC+1
```

The UTC offset must be calculated dynamically because daylight saving changes it.

Never hard-code offsets.

---

# 18. Clock Updates

Time cards should update every minute.

There is no need for one-second updates.

Use a single central timer.

Avoid creating one timer per card.

Example:

```ts
useEffect(() => {
  const interval = setInterval(() => {
    setNow(Date.now());
  }, 30_000);

  return () => clearInterval(interval);
}, []);
```

Update every 30 seconds so the UI changes promptly near minute boundaries.

---

# 19. Local Storage

Persist:

```text
selected timezones
their order
Home timezone
12/24-hour preference
theme
optional working hours
```

Suggested key:

```text
timezone-map.preferences.v1
```

Suggested schema:

```ts
interface StoredPreferences {
  version: 1;

  selectedTimezones: SelectedTimezone[];

  timeFormat: "12h" | "24h";

  theme: "light" | "dark" | "system";

  workingHours?: {
    start: number;
    end: number;
  };
}
```

Always version stored state so it can be migrated later.

---

# 20. Default First Visit

If no saved configuration exists:

1. use the browser's timezone

```ts
Intl.DateTimeFormat()
  .resolvedOptions()
  .timeZone
```

2. create the initial Home card from it
3. optionally add 2-3 example locations

Recommended default:

```text
Home only
```

This keeps the interface personal rather than demo-like.

A small suggestion may appear:

```text
Tap another place on the map to compare timezones.
```

---

# 21. DST Behaviour

DST should be handled automatically from the IANA timezone database.

Display:

```text
BST
UTC+1
```

rather than assuming London always means UTC.

The left panel may show:

```text
Daylight saving is currently in effect.
```

For regions with mixed DST rules, avoid claiming that an entire UTC band uses DST.

Instead describe the selected timezone.

---

# 22. Countries With Multiple Timezones

This is important.

Countries such as:

```text
United States
Canada
Australia
Russia
Brazil
Mexico
Indonesia
```

span multiple timezones.

Clicking such a country should not blindly add one timezone.

Instead show:

```text
United States

Select timezone

Eastern
Central
Mountain
Pacific
Alaska
Hawaii
```

or major cities:

```text
New York
Chicago
Denver
Los Angeles
Anchorage
Honolulu
```

Keep the desktop map/sidebar row at a stable height and scroll the sidebar internally.
Show a short list of common timezones first, with a filter that searches IANA names,
current and seasonal abbreviations (`PST`, `EDT`), and long names (`Eastern`). Each
result shows the IANA name, abbreviations, current long name, and UTC offset.

For smaller countries with one timezone, add immediately.

---

# 23. Click Mapping Behaviour

When clicking a coordinate:

```text
latitude / longitude
```

the application should determine the timezone at that point.

There are several possible implementations.

Preferred:

bundle geographic timezone boundary data locally.

Alternative:

associate countries with known timezone regions and ask for a city for multi-zone countries.

For the first version, the latter is significantly simpler.

Example:

```ts
country -> timezone[]
```

Single timezone:

```text
Japan -> Asia/Tokyo
```

Multiple timezone:

```text
United States ->
  America/New_York
  America/Chicago
  America/Denver
  America/Los_Angeles
  ...
```

A future release can add true coordinate-to-IANA timezone lookup.

---

# 24. Timezone Data

Create data files independently of components.

Suggested:

```text
src/data/
  countries.ts
  cities.ts
  timezones.ts
```

Example:

```ts
export interface CityRecord {
  name: string;
  countryCode: string;
  timezone: string;
  latitude: number;
  longitude: number;
  population?: number;
}
```

Only include major cities initially.

Approximately:

```text
300-1000 cities
```

is enough.

Do not initially ship a dataset containing every populated place in the world.

---

# 25. Country Data

Country model:

```ts
interface CountryRecord {
  code: string;
  name: string;
  timezones: string[];
  majorCities: string[];
}
```

Example:

```ts
{
  code: "GB",
  name: "United Kingdom",
  timezones: ["Europe/London"],
  majorCities: [
    "London",
    "Manchester",
    "Birmingham",
    "Edinburgh"
  ]
}
```

---

# 26. Compare Grid

The Compare workspace shows:

```text
COMPARE

New York
London
Berlin
Tokyo
Sydney

00 03 06 09 12 15 18 21
```

The overlap visualization lives in the dedicated **Compare** workspace rather than
the main map workspace. Primary navigation contains **Map** and **Compare** only.

Each timezone gets a horizontal row aligned to a shared 24-hour timeline. Every cell
shows that location's local hour in the user's selected 12- or 24-hour format, so a
separate time legend is unnecessary. The location name and current local time remain
prominent at the left. A vertical marker identifies the current instant.

Working, nighttime, and the intervening hours use muted yellow, purple, and blue.

Default working hours:

```text
09:00-17:00 local time
```

Working and nighttime ranges are shown above the grid, can be changed independently,
and are saved with the user's other local preferences. Defaults are 09:00–17:00 for
work and 22:00–06:00 for night. Do not calculate or highlight a maximum-overlap window;
the aligned colour-coded rows should make useful overlap apparent at a glance.

---

# 27. Future Time Slider

A useful extension is a time scrubber.

Example:

```text
Now ────────────────●──────── +12h
```

Moving the slider previews another moment.

Every timezone card changes simultaneously.

This allows questions such as:

```text
What time will it be in Tokyo when it is 9am here?
```

This feature is useful enough to design for now even if implemented later.

Maintain:

```ts
displayTimestamp
```

separately from:

```ts
Date.now()
```

---

# 28. Date Boundary Highlighting

When another timezone has moved to tomorrow or yesterday, make it visible.

Example:

```text
Sydney

12:24 AM

TOMORROW
```

Use typography rather than colour.

Possible styles:

```text
small uppercase badge
border
```

---

# 29. Responsive Design

## Desktop

Full layout:

```text
sidebar + map
timezone card row
overlap panel
```

## Tablet

Left information panel may shrink to:

```text
240px
```

Map remains visible.

Timezone cards horizontally scroll.

## Mobile

Do not attempt to preserve desktop layout.

Recommended:

```text
Map
Selected timezone details
Timezone cards
Overlap
```

The country detail panel stacks below the map.

Example:

```text
tap map

↓ bottom sheet

UTC+1
Central European Time

Germany
France
Italy
...
```

Timezone card row remains horizontally scrollable.

---

# 30. Mobile Map

The map should be pannable but not overly zoomable.

Touch behaviours:

```text
tap country
pinch zoom
drag map
```

Do not allow browser page scrolling to interfere with map dragging.

Use touch event handling carefully.

---

# 31. Component Structure

Suggested React structure:

```text
App

├── Header
│   ├── Logo
│   ├── Navigation
│   ├── GlobalSearch
│   ├── ThemeToggle
│   └── SetHomeButton
│
├── MainMapLayout
│   ├── TimezoneSidebar
│   │   ├── TimezoneHeader
│   │   ├── CountryList
│   │   └── CityList
│   │
│   └── WorldMap
│       ├── TimezoneBands
│       ├── CountryLayer
│       ├── CityMarker
│       └── MapControls
│
├── TimezoneStrip
│   ├── SortableTimezoneCard
│   └── AddTimezoneCard
│
├── OverlapHours
│
└── Footer
```

---

# 32. Suggested Source Tree

```text
src/
├── app/
│   ├── App.tsx
│   └── routes.ts
│
├── components/
│   ├── header/
│   │   ├── Header.tsx
│   │   ├── GlobalSearch.tsx
│   │   └── ThemeToggle.tsx
│   │
│   ├── map/
│   │   ├── WorldMap.tsx
│   │   ├── TimezoneBands.tsx
│   │   ├── CountryLayer.tsx
│   │   ├── CityMarker.tsx
│   │   └── MapControls.tsx
│   │
│   ├── timezone/
│   │   ├── TimezoneSidebar.tsx
│   │   ├── TimezoneCard.tsx
│   │   ├── TimezoneStrip.tsx
│   │   └── AddTimezoneCard.tsx
│   │
│   └── overlap/
│       └── OverlapHours.tsx
│
├── data/
│   ├── countries.ts
│   ├── cities.ts
│   └── timezones.ts
│
├── hooks/
│   ├── useClock.ts
│   ├── useLocalStorage.ts
│   └── useTimezoneStore.ts
│
├── lib/
│   ├── timezone.ts
│   ├── storage.ts
│   ├── search.ts
│   └── overlap.ts
│
├── types/
│   ├── timezone.ts
│   └── geography.ts
│
├── styles/
│   └── globals.css
│
└── main.tsx
```

---

# 33. State Management

React context is sufficient initially.

There is no need for Redux.

Recommended:

```text
TimezoneProvider
```

State:

```ts
interface AppState {
  selectedTimezones: SelectedTimezone[];

  activeTimezone?: string;

  homeTimezone: string;

  timeFormat: "12h" | "24h";

  displayTimestamp: number;

  theme: "light" | "dark" | "system";
}
```

Actions:

```text
addTimezone
removeTimezone
reorderTimezones
setHomeTimezone
selectTimezone
setTimeFormat
setDisplayTimestamp
```

If state becomes significantly more complex later, Zustand would be a suitable upgrade.

---

# 34. Tailwind Layout Guidance

Main container:

```tsx
<div className="mx-auto max-w-[1600px] px-6">
```

Main grid:

```tsx
<div className="
  grid
  grid-cols-[300px_minmax(0,1fr)]
  border-x
  border-neutral-200
">
```

Cards:

```tsx
<div className="
  min-w-[180px]
  rounded-md
  border
  border-neutral-200
  bg-white
  p-4
">
```

Home card:

```tsx
<div className="
  min-w-[180px]
  rounded-md
  border
  border-neutral-950
  bg-neutral-950
  p-4
  text-white
">
```

Keep border-radius modest.

Avoid the current trend of excessively rounded cards.

Suggested:

```text
4-8px
```

---

# 35. Accessibility

Every map country should have an accessible name where practical.

Example:

```text
Germany
UTC+1
Press Enter to select
```

Keyboard operation should support:

```text
Tab
Enter
Space
Escape
Arrow keys where appropriate
```

Search results must use proper combobox semantics.

Drag-and-drop must have a keyboard alternative.

For example:

```text
Move left
Move right
```

inside the card menu.

Do not rely solely on map interaction.

All map-selectable locations must also be available via search.

---

# 36. Performance

The app should feel instant.

Avoid:

```text
remote timezone APIs
large geographic libraries
high-frequency timers
massive city datasets
```

Use:

```text
SVG map
static JSON data
browser Intl APIs
Luxon
local storage
```

Lazy-load larger city datasets if necessary.

---

# 37. No Backend Requirement

Version one should require no backend.

Everything can run statically.

This means the application can be deployed to:

```text
GitHub Pages
Cloudflare Pages
Netlify
Vercel
```

without any server-side services.

That is desirable for this project.

---

# 38. Progressive Enhancement

The application should still show:

```text
selected timezone cards
search
timezone information
```

if map rendering fails.

The map should be treated as a powerful selection interface, not as the fundamental data model.

---

# 39. Suggested Implementation Stages

## Phase 1

Build visual skeleton.

Implement:

```text
header
sidebar
static map
timezone cards
responsive layout
```

Use hard-coded example data.

Goal:

match the supplied design closely.

---

## Phase 2

Implement real timezone clocks.

Add:

```text
Luxon
timezone formatting
DST
UTC offsets
live clock updates
```

---

## Phase 3

Add selection.

Implement:

```text
click map
select country
country timezone data
city selection
```

---

## Phase 4

Add persistence.

Implement:

```text
localStorage
Home timezone
card ordering
12/24-hour format
```

---

## Phase 5

Add drag-and-drop.

Use:

```text
@dnd-kit
```

Support desktop and touch.

---

## Phase 6

Add search.

Implement:

```text
city search
country search
timezone search
Cmd/Ctrl+K
```

---

## Phase 7

Add overlap hours.

Implement:

```text
working hours grid
cross-timezone comparison
maximum-overlap detection
```

---

## Phase 8

Improve mobile design.

Add:

```text
bottom-sheet timezone details
mobile map interactions
touch-friendly controls
```

---

# 40. Acceptance Criteria

The initial usable release is complete when:

* world map renders correctly
* timezone bands are visible
* countries can be selected
* selected timezone is displayed in the left panel
* a timezone can be added to the comparison strip
* cards display live local time
* cards display IANA timezone-derived UTC offset
* DST works automatically
* cards can be reordered
* cards can be removed
* one card can be Home
* Home is visually distinct
* selected timezones survive reload
* card ordering survives reload
* Home timezone survives reload
* search works for major cities, countries, and IANA timezone names
* selection never adds a comparison card without explicit confirmation
* UTC-band headings select the countries currently sharing that offset
* UTC-band inspection lists every matching country and does not mark one country as selected
* chevrons appear only on country rows that drill into further detail
* DST-observing locations show both their current abbreviation/offset and standard offset
* country detail avoids repeating the selected country as a second section
* every country detail includes its capital city, including countries without curated city data
* selected countries use the red accent fill
* offsets are labelled consistently as UTC
* 12/24-hour format is controlled from the header
* no footer is rendered
* desktop and mobile layouts are usable
* application works without a backend

---

# 41. Features Worth Designing For Now

These do not all need to exist in version one, but the architecture should leave room for them:

```text
meeting overlap hours
future-time slider
shareable timezone comparison URL
copy local time
keyboard search
automatic Home suggestion
day/night indicators
sunrise/sunset
timezone detail pages
country detail pages
DST change warnings
```

A share link could eventually encode:

```text
?tz=Europe/London,America/New_York,Asia/Tokyo
```

without requiring an account.

---

# 42. Features To Avoid Initially

Do not build:

```text
accounts
subscriptions
server-side profiles
calendar integrations
meeting booking
weather
IP geolocation services
map tiles
satellite maps
notifications
```

They would complicate a product whose appeal is simplicity.

---

# 43. Product Character

The site should feel closer to:

```text
a beautifully typeset reference tool
```

than:

```text
a SaaS dashboard
```

The defining elements are:

```text
large typography
strong spacing
precise grid
monochrome map
simple interaction
instant response
zero account friction
```

The map and timezone cards should always remain the dominant visual elements.

---

# 44. Initial Codex Build Brief

Use this as the first implementation instruction:

> Build a Vite React TypeScript application using Tailwind CSS that implements the timezone comparison interface described in this specification.
>
> Start with the desktop visual design and component architecture before adding functionality.
>
> Use a monochrome Swiss-inspired design with a large SVG world map, a 300px timezone information sidebar, and a horizontal timezone comparison card strip underneath.
>
> Use React functional components and TypeScript throughout.
>
> Use react-simple-maps for the world map, Luxon for timezone calculations, lucide-react for icons, and @dnd-kit for reorderable timezone cards.
>
> Use IANA timezone identifiers as the canonical timezone identity.
>
> Store selected locations, ordering, Home timezone, theme and time format in versioned localStorage.
>
> Do not add a backend.
>
> Implement the application incrementally and keep geographic data, timezone logic, storage logic and UI components separated.
>
> The first milestone should reproduce the supplied design closely using static example data for London, New York, Berlin, Tokyo and Sydney.
>
> Once the visual implementation is accurate, implement live timezone clocks, persistence, drag-and-drop, map selection, search and overlap hours in that order.
>
> Avoid unnecessary dependencies, excessive animation, large border radii and coloured UI elements.

---

# 45. Recommended First Development Commands

Assuming the Vite project does not already exist:

```bash
npm create vite@latest timezone-map -- --template react-ts
cd timezone-map

npm install

npm install luxon lucide-react react-simple-maps
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

npm install -D tailwindcss @tailwindcss/vite
```

Then configure Tailwind through the Vite plugin and begin with the page shell and static mock-up before implementing timezone data.

The visual design should be considered the first deliverable rather than something applied after the application logic is complete.
