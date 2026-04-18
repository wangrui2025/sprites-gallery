/**
 * Generate icon-manifest.json for centralized icon management.
 * Run: node scripts/generate-icon-manifest.mjs
 */

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PUBLIC_DIR = join(__dirname, '../public');
const MANIFEST_PATH = join(__dirname, '../public/icon-manifest.json');

// Use 'main' branch for CDN — avoids chicken-egg SHA mismatch problem
// (manifest SHA always lags behind the commit that contains it)
const GIT_REF = 'main';

// Icon set definitions
const ICON_SETS = [
  {
    id: 'pokemon-gen8-regular',
    name: 'Pokemon Gen8 Regular',
    description: 'Standard Pokemon sprites from Gen8',
    basePath: 'favicons/msikma_pokesprite/pokemon-gen8/regular',
    indexFile: 'favicons/index.json',
  },
  {
    id: 'pokemon-gen8-regular-female',
    name: 'Pokemon Gen8 Regular Female',
    description: 'Female variant Pokemon sprites from Gen8',
    basePath: 'favicons/msikma_pokesprite/pokemon-gen8/regular/female',
    indexFile: null,
  },
  {
    id: 'pokemon-gen8-shiny',
    name: 'Pokemon Gen8 Shiny',
    description: 'Shiny Pokemon sprites from Gen8',
    basePath: 'favicons/msikma_pokesprite/pokemon-gen8/shiny',
    indexFile: null,
  },
  {
    id: 'pokemon-gen8-special',
    name: 'Pokemon Gen8 Special',
    description: 'Egg and unknown Pokemon sprites from Gen8',
    basePath: 'favicons/msikma_pokesprite/pokemon-gen8',
    indexFile: null,
    filter: (f) => ['egg.png', 'egg-manaphy.png', 'unknown.png', 'unknown-gen5.png'].includes(f),
  },
];

function scanDirectory(dirPath, filter = null) {
  const icons = [];

  try {
    const entries = readdirSync(dirPath);

    for (const entry of entries) {
      if ((entry.endsWith('.png') || entry.endsWith('.jpg') || entry.endsWith('.svg')) && (!filter || filter(entry))) {
        icons.push(entry);
      }
    }
  } catch {
    // Directory doesn't exist, skip
  }

  return icons.sort();
}

function loadIndexJson(filePath) {
  try {
    const content = readFileSync(join(PUBLIC_DIR, filePath), 'utf-8');
    return JSON.parse(content);
  } catch {
    return null;
  }
}

function generateManifest() {
  const cdnBase = `https://cdn.jsdelivr.net/gh/wangrui2025/sprites-gallery@${GIT_REF}/public`;
  const manifest = {
    version: '1.0',
    generated: new Date().toISOString(),
    gitRef: GIT_REF,
    cdnBase,
    iconSets: {},
  };

  for (const set of ICON_SETS) {
    let icons = [];

    if (set.indexFile) {
      const indexData = loadIndexJson(set.indexFile);
      icons = indexData || [];
    } else {
      const fullPath = join(PUBLIC_DIR, set.basePath);
      icons = scanDirectory(fullPath, set.filter);
    }

    if (icons.length > 0) {
      manifest.iconSets[set.id] = {
        name: set.name,
        description: set.description,
        baseUrl: `/${set.basePath}`,
        iconCount: icons.length,
        icons: icons.map((icon) => ({
          fileName: icon,
          url: `${cdnBase}/${set.basePath}/${icon}`,
        })),
      };
    }
  }

  return manifest;
}

const manifest = generateManifest();
writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2));

console.log(`✓ Manifest generated: ${MANIFEST_PATH}`);
console.log(`  Icon sets: ${Object.keys(manifest.iconSets).length}`);
for (const [id, set] of Object.entries(manifest.iconSets)) {
  console.log(`  - ${id}: ${set.iconCount} icons`);
}
