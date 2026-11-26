# Website Passport · Pokémon Sprite Gallery

Profile: full. Canonical serving URL: https://wangrui2025.github.io/sprites-gallery/

| Area | Owner / check |
|---|---|
| W01 Reader | `src/lib/agent-reader.ts`, `src/pages/agent/index.astro`, `src/pages/agent/site.json.ts`, `public/llms.txt`; verify built output via `npm run check:reader`. |
| W02 Design | [Design](../design/README.md), `src/styles/global.css`, `src/layouts/BaseLayout.astro`. |
| W03 Responsive | Desktop 1440×900 and mobile 440×956 DPR3/touch; actual links and controls; report checks not run. |
| W04 Expression | [Wish](../wish/LATEST.md) and actual content/source definitions; distinguish known facts, suggestions and missing evidence. |
| W05 Engineering | `package.json`, lockfile, Astro source; clean install and static build. |
| W06 CI | DEPLOY_ONLY; [Dev direction](LATEST.md) and actual hosting workflow/config. Do not infer production from local build. |
| W07 Security | Public content only; no credentials, private records, unauthorized assets or internal control-plane metadata. Verify actual publish scope. |
| W08 Accessibility/performance | Test focus, navigation, overflow, image states and relevant interaction/loading; retain limitations of browser emulation and external dependencies. |
| W09 Governance | [AGENTS](../../AGENTS.md), [Wish](../wish/README.md), [Dev](README.md), [Design](../design/README.md). |

Freshness: the reader is a source-derived catalog, not a real-time status claim. Any future checked/updated claim needs its real source instant and visible PT/SGT display with supported precision. This map is an implementation contract, not a blanket compliance certification.

Feature-level goals and protected semantics: [Intent](../intent/README.md). This file retains its existing ownership and history.
