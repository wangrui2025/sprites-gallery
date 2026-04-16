#!/usr/bin/env node
/**
 * Post-build script: inline all CSS into HTML pages.
 *
 * Reads CSS files referenced in each HTML page, inlines their FULL content
 * as <style is:inline> in <head>, and REMOVES the external <link> tag.
 *
 * This prevents FOUC in CI/CD environments where external CSS download
 * blocks the render pipeline.
 */
import fs from 'node:fs';
import path from 'node:path';

/** Recursively find all HTML files in a directory */
function findHtmlFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) results.push(...findHtmlFiles(full));
    else if (entry.name.endsWith('.html')) results.push(full);
  }
  return results;
}

const DIST_DIR = path.join(process.cwd(), 'dist');
const htmlFiles = findHtmlFiles(DIST_DIR);
console.log(`[inline-critical-css] Found ${htmlFiles.length} HTML files`);

for (const htmlPath of htmlFiles) {
  let html = fs.readFileSync(htmlPath, 'utf-8');

  // Find all external CSS <link> tags (any path containing /_astro/)
  const cssLinks = [...html.matchAll(/<link([^>]*)href="([^"]*_astro\/[^"]+\.css[^"]*)"([^>]*)>/g)];

  if (cssLinks.length === 0) {
    console.log(`[inline-critical-css] No CSS links in ${path.relative(DIST_DIR, htmlPath)}`);
    continue;
  }

  // Read all referenced CSS files
  const seenFiles = new Set();
  let allCssContent = '';
  const linkTags = [];

  for (const match of cssLinks) {
    // match[0] = full tag, match[2] = href
    const href = match[2];
    const fullTag = match[0];
    linkTags.push(fullTag);

    if (seenFiles.has(href)) continue;
    seenFiles.add(href);

    // Strip leading base path (e.g. /sprites-gallery/) to resolve locally inside dist/
    const localPath = href.replace(/^\//, '').replace(/^sprites-gallery\//, '');
    const cssFilePath = path.join(DIST_DIR, localPath);
    if (fs.existsSync(cssFilePath)) {
      allCssContent += fs.readFileSync(cssFilePath, 'utf-8') + '\n';
    }
  }

  if (!allCssContent) {
    console.log(`[inline-critical-css] No CSS files found for ${path.relative(DIST_DIR, htmlPath)}`);
    continue;
  }

  // Remove all external CSS <link> tags from HTML
  for (const linkTag of linkTags) {
    html = html.replace(linkTag, '');
  }

  // Remove any previous critical CSS block
  html = html.replace(
    /<!-- critical-inlined-css -->\s*<style is:inline>\s*[\s\S]*?<\/style>\s*/g,
    ''
  );

  // Find the </head> position
  const headEnd = html.lastIndexOf('</head>');
  if (headEnd < 0) {
    console.warn(`[inline-critical-css] No </head> in ${path.relative(DIST_DIR, htmlPath)}`);
    continue;
  }

  // Insert full CSS inline before </head>
  const styleTag =
    `\n<!-- critical-inlined-css (${allCssContent.length} bytes) -->\n` +
    `<style is:inline>\n${allCssContent}\n</style>\n`;
  html = html.slice(0, headEnd) + styleTag + html.slice(headEnd);

  fs.writeFileSync(htmlPath, html, 'utf-8');
  console.log(
    `[inline-critical-css] Inlined ${(allCssContent.length / 1024).toFixed(0)}KB CSS into ${path.relative(DIST_DIR, htmlPath)} (${linkTags.length} link tags removed)`
  );
}

console.log('[inline-critical-css] Done');
