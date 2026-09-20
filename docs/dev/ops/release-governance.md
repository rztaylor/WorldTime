# Release governance

World Time uses SemVer tags (`vMAJOR.MINOR.PATCH`) and a curated `CHANGELOG.md`. During `0.x`, minor releases may evolve UI and stored schemas, but migrations must preserve valid saved preferences whenever practical.

A release candidate must pass `npm run check` and `npm run test:browser`. Any skipped validation is a release blocker unless the release notes name the reason, affected surface, and residual risk. Security, data-loss, broken persistence, inaccessible core workflows, and non-functional static builds are blockers.

The release artifact is the Vite `dist/` directory. Production is hosted by ChatGPT Sites at `https://tz.rztaylor.chatgpt.site`, bound through `.openai/hosting.json`. Publishing is manual: push the exact committed source state to the Site's managed repository, save that commit as a Site version with its packaged build output, and deploy the saved version. No checksums or signing are required. Rollback means redeploying a previous saved Site version. Prereleases use SemVer prerelease suffixes and must not replace a stable deployment without explicit review.
