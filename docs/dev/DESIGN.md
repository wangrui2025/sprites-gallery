# Development design

- Source/history: this GitHub repository and its reviewed main branch.
- Validation: repository-owned build and reader checks, with local rendered tests for UI changes. The existing Pages workflow provides deployment build compute.
- Production: GitHub Actions deploy.yml builds on main using Node 22, npm ci and npm run build; GitHub Pages serves dist. Existing README documents DEPLOY_ONLY and the build/astro check. No new CI provider or ruleset.
- Runtime: static output; external sprite providers and local browser preferences are separate runtime concerns. Do not add a server or second hosted CI provider without a demonstrated need.
- Recovery: preserve Git history; investigate actual provider status and release the last known-good reviewed source using the authorized deployment path. Do not change identity, billing, visibility or credentials as a workaround.

Build success is not proof of appearance, user acceptance, source freshness or external service availability.
