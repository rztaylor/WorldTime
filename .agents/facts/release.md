# Release facts

- Maturity: initial usable web release; SemVer beginning at `0.x`.
- Tags: `vMAJOR.MINOR.PATCH` from `main` after a reviewed pull request.
- Release notes source: curated `CHANGELOG.md`; governance: `docs/dev/ops/release-governance.md`.
- Default validation: `npm run check`; release-candidate validation additionally requires `npm run test:browser`.
- Artifact: static `dist/` directory. No archive naming, checksums, signing, notarization, SBOM, or attestation is currently required.
- Target host: Cloudflare Pages project `world-time` at `https://tz.rztaylor.uk`; Pages URL: `https://world-time-2gj.pages.dev`.
- Production source branch: `release`. GitHub Actions runs `npm run check` and `npm run test:browser`, then deploys `dist/` by Direct Upload.
- Publishing uses `.github/workflows/publish-pages.yml` and the GitHub Actions `Live` environment with `CLOUDFLARE_API_TOKEN`. The interactive Cloudflare MCP credential is separate from the Actions token. Keep credentials out of the repository.
- Rollback uses a previous successful Pages deployment. ChatGPT Sites is no longer a publishing target.
- Ordinary validation requires no credentials. Skipped checks must be named with reason and residual risk.
- Supported browsers: current evergreen desktop and mobile browsers with ES2022, SVG, Intl, and localStorage support.
