# Frontend UI facts

- Frontend root: `src/`; framework: React 19 with TypeScript and Vite.
- Layering: CSS tokens → shared primitives/patterns → feature components → `App` composition.
- Theme and repeated visual values live in `src/styles/globals.css`; Tailwind utilities handle local composition.
- The shell has Map and Compare workspace views. Desktop Map uses a compact 270px sidebar plus map followed by a full-width timezone strip; mobile Map stacks map, details, then the timezone strip. Compare owns a per-location 24-hour schedule with configurable work and night ranges; those range controls are collapsed by default on mobile.
- The desktop timezone strip is a five-column grid capped at ten cards; mobile cards flow across responsive rows and are hidden while a map country is selected so country details remain prominent.
- Shared app state and persistence live in `src/app/TimezoneProvider.tsx`; ephemeral search and map zoom stay local.
- Domain data comes from `src/data`; time/search/overlap/storage behavior comes from `src/lib`.
- Component variants use typed props and composition. Avoid parallel page-local control or card systems.
- Accessibility: labeled controls, semantic combobox search, keyboard-accessible selection and card move actions, visible focus, reduced-motion support, and touch targets of at least 40px for primary map/header controls.
- UI validation: `npm run test`, `npm run build`, and `npm run test:browser`; inspect desktop 1440×1000 and mobile 390×844 screenshots.
