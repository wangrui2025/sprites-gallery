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
| 6 | Favicon URL mapping without ID lookup | `fetch /pokemon/{id} → name → local file` inline in render | Pre-fetch names server-side; pass as prop to client components |

## Project-specific notes

- **i18n routing**: Dynamic route `src/pages/[lang]/index.astro` generates `/en/` and `/zh/` pages.
- **UI strings i18n**: All UI strings (buttons, labels, messages) are in `src/i18n/ui.ts`.
- **No Tailwind v4**: Uses plain CSS in `src/styles/global.css`.
- **No ClientRouter**: Single-page app with no view transitions; acceptable.
- **No JSON-LD**: Not a content-heavy site; Open Graph tags in `BaseLayout.astro` are sufficient.
- **Favicon init**: The inline theme script and favicon randomizer in `BaseLayout.astro` are intentionally kept as `is:inline` to prevent FOUC.
- **Favicon path uses ID → Name → Local file**: Only the favicon card requires a PokeAPI lookup to resolve numeric ID to English name for local file resolution. All other sprite cards use direct ID-based URLs to external sources (PokeAPI, Showdown, HOME, etc.) with no name lookup needed.

## Technical Architecture

### Layer 1 — Grid Sprites (ID-Only, No Name Mapping)
All external sprite sources (PokeAPI, Showdown, HOME, etc.) store URLs by numeric Pokemon ID.
The frontend constructs URLs directly: `.../pokemon/{id}.png`
No PokeAPI lookup needed for these images.

### Layer 2 — Favicon (ID → Name → Local File)
Local favicon files in `public/favicons/` are named by Pokemon English name (e.g., `pikachu.png`).
This requires a different path:
1. Random ID → `https://pokeapi.co/api/v2/pokemon/{id}` → extract English name
2. Name cleanup: `toLowerCase().replace(/[^a-z0-9]/g, '')`
3. Read local file: `/sprites-gallery/favicons/{name}.png`

The favicon card in the grid uses Layer 2; all other sprite cards use Layer 1.

### File Structure

```
src/
├── layouts/BaseLayout.astro       ← HTML shell, LanguagePicker, theme init
├── pages/
│   ├── index.astro                  ← Redirect → /zh/
│   └── [lang]/index.astro         ← Dynamic route: /en/ + /zh/ (i18n)
├── components/LanguagePicker.astro ← Language switcher
├── script/gallery.ts               ← Client-side logic (events, API, state)
├── data/sprite-sources.ts          ← Sprite source configs + URL builders
├── i18n/ui.ts + utils.ts           ← i18n strings + routing helpers
└── styles/global.css                ← Global styles + theme variables
```

**Note**: All UI strings are internationalized via `src/i18n/ui.ts`.

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
