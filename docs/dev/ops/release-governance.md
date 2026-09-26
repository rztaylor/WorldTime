# Release governance

World Time uses SemVer tags (`vMAJOR.MINOR.PATCH`) and a curated `CHANGELOG.md`. During `0.x`, minor releases may evolve UI and stored schemas, but migrations must preserve valid saved preferences whenever practical.

A release candidate must pass `npm run check` and `npm run test:browser`. Any skipped validation is a release blocker unless the release notes name the reason, affected surface, and residual risk. Security, data-loss, broken persistence, inaccessible core workflows, and non-functional static builds are blockers.

The release artifact is the Vite `dist/` directory. Production uses the Cloudflare Pages Direct Upload project `world-time` at `https://tz.rztaylor.uk` (Pages URL: `https://world-time-2gj.pages.dev`). The `.github/workflows/publish-pages.yml` workflow builds and validates pushes to `release`, then deploys `dist/` with Wrangler. It uses the GitHub Actions `Live` environment and `CLOUDFLARE_API_TOKEN`; the account ID is recorded in `.agents/facts/cloudflare-pages.md`. Manage the Pages project, custom domain, and DNS through the Cloudflare MCP. Rollback means restoring a previous successful Pages deployment. ChatGPT Sites is no longer a publishing target. Prereleases use SemVer prerelease suffixes and must not replace a stable deployment without explicit review.
