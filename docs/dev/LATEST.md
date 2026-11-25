# Current development direction

CI mode: `DEPLOY_ONLY`.

Static Astro site with Tailwind CSS and TypeScript. GitHub Actions deploy.yml builds on main using Node 22, npm ci and npm run build; GitHub Pages serves dist. Existing README documents DEPLOY_ONLY and the build/astro check. No new CI provider or ruleset.

Local validation: `npm ci`, `npm run build`, `npm run check:reader`, and `npx astro check` when validating TypeScript. The first three commands validate installed dependencies, static output and the reader contract. Hosted deployment and real browser evidence are separate. Keep all paid features and new service dependencies opt-in.
