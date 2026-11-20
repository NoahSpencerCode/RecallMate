#!/usr/bin/env node
/**
 * Renders the RecallMate brand mark (the brain from src/components/brainPath.ts
 * on the violet→pink tile, same as <LogoMark />) into the app icon, Android
 * adaptive icon layers, splash image and favicon.
 *
 *   npm install --no-save sharp && node scripts/build-icons.mjs
 */
import { Buffer } from 'node:buffer';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.error('This script needs sharp: run `npm install --no-save sharp` first.');
  process.exit(1);
}

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'assets', 'images');
const brandDir = join(root, 'assets', 'brand');
mkdirSync(out, { recursive: true });
mkdirSync(brandDir, { recursive: true });

const brainSource = readFileSync(join(root, 'src', 'components', 'brainPath.ts'), 'utf8');
const BRAIN = brainSource.match(/BRAIN_PATH =\s*'([^']+)'/)[1];

const gradient = `
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#6C4DFF"/><stop offset="0.55" stop-color="#A34DFF"/><stop offset="1" stop-color="#FF4FA3"/>
    </linearGradient>
  </defs>`;

const brain = (color = '#FFFFFF') => `<path d="${BRAIN}" fill="${color}" fill-rule="evenodd"/>`;

const svg = (body, { rounded = false, background = true } = {}) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024">${gradient}
  ${background ? `<rect width="1024" height="1024" ${rounded ? 'rx="232"' : ''} fill="url(#bg)"/>` : ''}
  ${body}
</svg>`;

// Android adaptive icons crop to the central ~66%, so shrink the brain to fit.
const safeZone = (body) => `<g transform="translate(512 537) scale(0.72) translate(-511 -537)">${body}</g>`;

const files = [
  ['icon.png', svg(brain()), 1024],
  ['splash-icon.png', svg(brain(), { rounded: true }), 512],
  ['favicon.png', svg(brain(), { rounded: true }), 196],
  ['android-icon-background.png', svg(''), 1024],
  ['android-icon-foreground.png', svg(safeZone(brain()), { background: false }), 1024],
  ['android-icon-monochrome.png', svg(safeZone(brain()), { background: false }), 1024],
];

for (const [name, source, size] of files) {
  await sharp(Buffer.from(source)).resize(size, size).png({ compressionLevel: 9 }).toFile(join(out, name));
  console.log(`assets/images/${name} (${size}×${size})`);
}

writeFileSync(join(brandDir, 'logo.svg'), svg(brain(), { rounded: true }));
console.log('assets/brand/logo.svg');
