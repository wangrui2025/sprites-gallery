/**
 * Generate icon-manifest.json for centralized icon management.
 * Run: node scripts/generate-icon-manifest.mjs
 */

import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { writeFileSync } from 'node:fs';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const PUBLIC_DIR = join(__dirname, '../public');
const MANIFEST_PATH = join(__dirname, '../public/icon-manifest.json');

// Icon set definitions
const ICON_SETS = [
  {
    id: 'pokemon-gen8-regular',
    name: 'Pokemon Gen8 Regular',
    description: 'Standard Pokemon sprites from Gen8',
    basePath: 'favicons',
    recursive: false,
  },
  {
    id: 'pokemon-gen8-shiny',
    name: 'Pokemon Gen8 Shiny',
    description: 'Shiny Pokemon sprites from Gen8',
    basePath: 'favicons/msikma_pokesprite/pokemon-gen8/shiny',
    recursive: false,
  },
  {
    id: 'pokemon-gen8-special',
    name: 'Pokemon Gen8 Special',
    description: 'Egg and unknown Pokemon sprites from Gen8',
    basePath: 'favicons/msikma_pokesprite/pokemon-gen8',
    recursive: false,
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

function generateManifest() {
  const manifest = {
    version: '1.0',
    generated: new Date().toISOString(),
    iconSets: {},
  };

  for (const set of ICON_SETS) {
    const fullPath = join(PUBLIC_DIR, set.basePath);
    const icons = scanDirectory(fullPath, set.recursive, set.filter);

    if (icons.length > 0) {
      manifest.iconSets[set.id] = {
        name: set.name,
        description: set.description,
        baseUrl: `/${set.basePath}`,
        iconCount: icons.length,
        icons: icons.map((icon) => ({
          fileName: icon,
          url: `/${set.basePath}/${icon}`,
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
