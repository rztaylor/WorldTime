# Release facts

- Maturity: initial usable web release; SemVer beginning at `0.x`.
- Tags: `vMAJOR.MINOR.PATCH` from `main` after a reviewed pull request.
- Release notes source: curated `CHANGELOG.md`; governance: `docs/dev/ops/release-governance.md`.
- Default validation: `npm run check`; release-candidate validation additionally requires `npm run test:browser`.
- Artifact: static `dist/` directory. No archive naming, checksums, signing, notarization, SBOM, or attestation is currently required.
- Target host: ChatGPT Sites at `https://tz.rztaylor.chatgpt.site`; the opaque project binding is stored in `.openai/hosting.json`.
- Publishing is manual through the Sites managed source repository: push the exact committed source state, save that commit as a Site version, then deploy it.
- Ordinary validation requires no credentials. Skipped checks must be named with reason and residual risk.
- Supported browsers: current evergreen desktop and mobile browsers with ES2022, SVG, Intl, and localStorage support.
