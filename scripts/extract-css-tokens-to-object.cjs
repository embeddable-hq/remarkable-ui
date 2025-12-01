/* eslint-env node */
/* eslint-disable @typescript-eslint/no-require-imports */

// scripts/extract-css-tokens-to-object.cjs
// Usage: node scripts/extract-css-tokens-to-objects.cjs src/styles/global.css

const fs = require('fs');
const path = require('path');

const inputPath = process.argv[2];

if (!inputPath) {
  console.error('Usage: node split-tokens.js <input-file.css>');
  process.exit(1);
}

const css = fs.readFileSync(inputPath, 'utf8');
const lines = css.split(/\r?\n/);

// Token buckets
let core = {};
const semantics = {};
const component = {};

// Parse lines that contain CSS custom properties
for (const rawLine of lines) {
  const line = rawLine.trim();

  // Only care about custom props
  if (!line.startsWith('--em-')) continue;

  // Match: --em-something: value;
  const match = line.match(/^(--em-[^:]+)\s*:\s*([^;]+);?/);
  if (!match) continue;

  const name = match[1];
  const value = match[2].trim();

  if (name.startsWith('--em-core-')) {
    core[name] = value;
  } else if (name.startsWith('--em-sem-')) {
    semantics[name] = value;
  } else {
    component[name] = value;
  }
}

// --------------------------------------------------------
// Overrides — Tokens that Figma exports incorrectly
// --------------------------------------------------------
core = {
  ...core,
  '--em-core-font-weight--bold': '700',
  '--em-core-font-weight--medium': '500',
  '--em-core-font-weight--regular': '400',
};

// Build output file path
const baseName = path.basename(inputPath, path.extname(inputPath));
const dirName = path.dirname(path.resolve(inputPath));
const outPath = path.join(dirName, `${baseName}.tokens.ts`);

// --------------------------------------------------------
// Build a TS module that exports the token objects
// --------------------------------------------------------
const tsModule =
  `// Auto-generated from ${path.basename(inputPath)}\n` +
  `// Do not edit manually.\n\n` +
  `export const stylesTokensCore = ${JSON.stringify(core, null, 2)};\n\n` +
  `export const stylesTokensSemantic = ${JSON.stringify(semantics, null, 2)};\n\n` +
  `export const stylesTokensComponents = ${JSON.stringify(component, null, 2)};\n\n` +
  `type StylesTokensCore = typeof stylesTokensCore;\n` +
  `export type StylesTokensCoreKeys = keyof StylesTokensCore;\n\n` +
  `type StylesTokensSemantic = typeof stylesTokensSemantic;\n` +
  `export type StylesTokensSemanticKeys = keyof StylesTokensSemantic;\n\n` +
  `type StylesTokensComponents = typeof stylesTokensComponents;\n` +
  `export type StylesTokensComponentsKeys = keyof StylesTokensComponents;\n`;

fs.writeFileSync(outPath, tsModule, 'utf8');

console.log('Generated tokens TS module:');
console.log('  →', outPath);
