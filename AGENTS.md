# Agent entrypoint · Pokémon Sprite Gallery

- Current product intent: [Wish](docs/wish/LATEST.md); information architecture: [Wish Design](docs/wish/DESIGN.md).
- Visual authority: [Design](docs/design/README.md) and `src/styles/global.css`.
- Engineering/CI: [Dev](docs/dev/README.md), [Website Passport](docs/dev/WEBSITE_PASSPORT.md), `package.json` and the real deployment configuration.
- Content/source facts: `src/data/sprite-sources.ts`, gallery source and external providers.
- Public reader: `/agent/`, `/agent/site.json`, `/llms.txt` relative to the site's base.

Before edits, check exact main and overlapping PRs. Preserve the user's project intention, source provenance and existing public/approval boundaries. Never add credentials, private records or unapproved images to public output. Build and test the changed layer; report exact-head CI and production independently. Do not introduce paid services, hosting changes or permission changes without separate approval.

For material page/feature changes, resolve the relevant [Feature Design](docs/design/features/README.md) (intent and realization), preserve source-backed essential outcomes, then actively compare and verify a better feasible design using the latest owner intent, technology and evidence. Do not freeze the old implementation or infer approval from a passing test.
