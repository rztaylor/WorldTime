# Cloudflare Pages

- Account ID: `bc55ee3751780a67f14ea978c717ff47`.
- Pages project: `world-time`; Pages URL: `https://world-time-2gj.pages.dev`.
- Production hostname: `https://tz.rztaylor.uk` in the Cloudflare-managed `rztaylor.uk` zone.
- Hosting mode: Direct Upload. GitHub Actions builds and deploys; do not enable Pages Git integration for this project.
- Production branch: `release`.
- Workflow: `.github/workflows/publish-pages.yml`.
- Build: `npm ci`, `npm run check`, and `npm run test:browser`; upload `dist/` with Wrangler.
- GitHub Actions environment: `Live`; secret: `CLOUDFLARE_API_TOKEN`. Never store or print the token in repository files or logs.
- DNS: proxied CNAME `tz.rztaylor.uk` → `world-time-2gj.pages.dev` is configured and Pages domain validation is active.
- First production deployment succeeded from `release` on 2026-09-26; verify the latest deployment and commit through Cloudflare Pages and GitHub Actions when publishing again.
