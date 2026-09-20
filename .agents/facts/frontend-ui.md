# Frontend UI facts

- Frontend root: `src/`; framework: React 19 with TypeScript and Vite.
- Layering: CSS tokens → shared primitives/patterns → feature components → `App` composition.
- Theme and repeated visual values live in `src/styles/globals.css`; Tailwind utilities handle local composition.
- The shell is a single page. Desktop uses a 300px sidebar plus map; mobile stacks map, timezone strip, details, then overlap.
- Shared app state and persistence live in `src/app/TimezoneProvider.tsx`; ephemeral search and map zoom stay local.
- Domain data comes from `src/data`; time/search/overlap/storage behavior comes from `src/lib`.
- Component variants use typed props and composition. Avoid parallel page-local control or card systems.
- Accessibility: labeled controls, semantic combobox search, keyboard-accessible selection and card move actions, visible focus, and reduced-motion support.
- UI validation: `npm run test`, `npm run build`, and `npm run test:browser`; inspect desktop 1440×1000 and mobile 390×844 screenshots.
