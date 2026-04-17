# Pokemon Favicon Gallery

A live showcase for comparing Pokemon sprite sources — and setting any sprite as your browser's favicon.

## The Purpose

**Why this exists:** A Pokemon fan site where the browser tab icon itself is a Pokemon. Every page refresh gives you a different random Pokemon as your favicon — making your browser tab feel alive.

This is **not just a sprite viewer**. The core experience is:
1. You open the page → a random Pokemon appears as your browser tab icon
2. The grid below shows that Pokemon across 9+ sprite sources simultaneously
3. You can browse, compare, or set any source as your permanent favicon

### Features

- **Random Favicon** — Each page load picks a random Pokemon (1–1025) and sets it as your browser tab icon instantly (no server needed)
- **Sprite Comparison** — View any Pokemon (by ID) across 9+ sprite sources simultaneously, including Gen I-V pixel art, modern pixel renders, 3D home renders, and official artwork
- **Set as Favicon** — Click "Set Favicon" on any card to instantly update your browser tab icon
- **Persistent on Refresh** — Your chosen favicon Pokemon syncs across page loads via localStorage
- **Generation Filter** — Filter by game generation to narrow down sources

### How It Works

#### Layer 1 — Grid Sprites (ID-Only)
All external sprite sources (PokeAPI, Pokemon Showdown, HOME, etc.) store images by numeric Pokemon ID. The frontend constructs URLs directly:
```
https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png
```
No name lookup needed — just pass the ID.

#### Layer 2 — Favicon (ID → Name → Local File)
Local favicon files in `public/favicons/` are named by Pokemon English name (e.g. `pikachu.png`). Since the page starts with a random numeric ID, it must:
1. Fetch `https://pokeapi.co/api/v2/pokemon/{id}` to get the English name
2. Clean the name: `toLowerCase().replace(/[^a-z0-9]/g, '')`
3. Resolve to local file: `/favicons/{name}.png`

The favicon card in the grid uses Layer 2 (indicated by the purple **ID → Name → Local** tag). All other cards use Layer 1.

### Tech Stack

- **Astro 6.x** (static site, no server needed)
- Plain CSS (no Tailwind)
- PokeAPI for real-time Pokemon data
- GitHub Pages deployment

### Usage

1. Enter a Pokemon ID (1–1025) in the input box
2. Click **Random** (or press `R`) to pick one at random
3. Browse the grid — click **Set Favicon** on any card to apply it
4. Press `F` to quickly set the currently focused source as favicon
5. Use arrow keys or the input to navigate between Pokemon
