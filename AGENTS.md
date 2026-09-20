# Repository guidance

World Time is a static, client-side timezone comparison tool. Treat `docs/PRODUCT.md` as the product source of truth and `docs/images/design.png` as the approved visual direction.

- Read `.agents/facts/` before changing product behavior, architecture, UI, tests, docs, release policy, or Git workflow.
- Keep the app backend-free. Do not add accounts, remote timezone APIs, map tiles, or secret-bearing configuration.
- Use IANA timezone identifiers as canonical identities and derive current offsets from Luxon.
- Keep geographic records, time calculations, storage, and UI components in separate owners.
- Run `npm run check` for ordinary validation and `npm run test:browser` for rendered interaction checks.
- Work on feature branches and use focused commits and pull requests. Never modify the default branch directly.
