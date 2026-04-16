# Sprites Gallery — Astro 6.x Checklist

> Frozen ADR v1.0 reference: `~/.claude/memory/astro-6-modernization-checklist.md`

## Definition of Done

- [ ] `npx astro check` → 0 errors / 0 warnings / 0 hints
- [ ] `npm run build` → passes (including post-build script)
- [ ] Node.js `>=22.12.0` in `package.json`
- [ ] Sharp image service explicitly configured in `astro.config.mjs`

## Hard Nos for this project

| # | Forbidden | Old pattern | Correct pattern |
|---|-----------|-------------|-----------------|
| 1 | String URL concat for paths | `` `/${base}${path}` `` | Use `new URL(path, base)` or Astro helpers |
| 2 | `Astro.glob` | `Astro.glob(...)` | `import.meta.glob(..., { eager: true })` |
| 3 | `ViewTransitions` | `<ViewTransitions />` | `<ClientRouter />` (if transitions are ever added) |
| 4 | Unused imports | `import { unused } from '...'` | Remove or use them |
| 5 | Implicit `any` in TS | `.map((t) => ...)` | `.map((t: string) => ...)` |

## Project-specific notes

- **No i18n**: This is a single-language gallery; i18n routing is intentionally omitted.
- **No Tailwind v4**: Uses plain CSS in `src/styles/global.css`.
- **No ClientRouter**: Single-page app with no view transitions; acceptable.
- **No JSON-LD**: Not a content-heavy site; Open Graph tags in `BaseLayout.astro` are sufficient.
- **Favicon init**: The inline theme script and favicon randomizer in `BaseLayout.astro` are intentionally kept as `is:inline` to prevent FOUC.

## Regression checks (run after `npm run build`)

```bash
# Build output exists
ls -d dist/

# TypeScript clean
npx astro check

# Open Graph tags present
grep -r "og:image" dist/

# No unexpected is:inline
test -z "$(grep -r 'is:inline' dist/ | grep -v 'third-party')" && echo "OK" || echo "WARN"
```
