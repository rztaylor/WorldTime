# Testing facts

- `npm run test`: Vitest unit/component suite.
- `npm run typecheck`: TypeScript validation without emitting files.
- `npm run lint`: ESLint source and test validation.
- `npm run build`: production bundle validation.
- `npm run test:browser`: Playwright desktop/mobile interaction and screenshot checks.
- `npm run check`: typecheck, lint, unit tests, then production build.
- Tests need no credentials or external services. Browser tests start the local Vite preview server.
- Browser installation is an external prerequisite for Playwright; a skipped browser check must be reported explicitly.
