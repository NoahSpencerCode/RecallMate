#!/usr/bin/env node
/**
 * Copies KaTeX's stylesheet and fonts into public/katex so the web app can
 * typeset math (public/index.html links the stylesheet). Only the woff2 fonts
 * ship; every browser the app supports reads them. Re-run after upgrading katex:
 *
 *   node scripts/vendor-katex.mjs
 */
import { copyFileSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const dist = join(dirname(require.resolve('katex/package.json')), 'dist');
const out = join(root, 'public', 'katex');

rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, 'fonts'), { recursive: true });

// font-display: swap shows fallback text instead of nothing while a font loads.
const css = readFileSync(join(dist, 'katex-swap.min.css'), 'utf8').replace(
  /,url\(fonts\/[^)]+\.woff\) format\("woff"\),url\(fonts\/[^)]+\.ttf\) format\("truetype"\)/g,
  '',
);
if (/\.woff\)|\.ttf\)/.test(css)) throw new Error('Unexpected @font-face format in katex-swap.min.css');
const { version } = JSON.parse(readFileSync(join(dist, '..', 'package.json'), 'utf8'));
writeFileSync(join(out, 'katex.min.css'), `/* KaTeX ${version} (MIT), copied by scripts/vendor-katex.mjs */\n${css}`);

const fonts = readdirSync(join(dist, 'fonts')).filter((file) => file.endsWith('.woff2'));
for (const font of fonts) copyFileSync(join(dist, 'fonts', font), join(out, 'fonts', font));
console.log(`Copied KaTeX ${version}: stylesheet and ${fonts.length} fonts into public/katex.`);
