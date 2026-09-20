# Repository setup facts

- Repository classification: greenfield browser application initialized from `docs/PRODUCT.md`.
- Package manager: npm with a committed lockfile.
- Runtime stack: Vite, React, TypeScript, Tailwind CSS, Luxon, react-simple-maps, dnd-kit, and Lucide.
- Source root: `src/`; browser tests: `tests/`; developer documentation: `docs/dev/`.
- Bundled geographic data comes from the `world-atlas` package; core behavior must not require network access.
- Repeated validation is exposed through package scripts, especially `npm run check`.
