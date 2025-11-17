#!/usr/bin/env node
// scripts/check-css-vars.mjs
// Checks **/*.module.css for var(--TEMP-*) usage against a TS export (flat or nested).
// Reports missing vars as compact, clickable links that jump to line/column
// (VS Code/JetBrains aware; OSC 8 hyperlinks for clean console output).

/* eslint-disable @typescript-eslint/no-unused-expressions */

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import fg from 'fast-glob';
import { createRequire } from 'node:module';

// ---------- esbuild-register to load TS ----------
let unregister = null;
let requireCjs = null;
try {
  const { register } = await import('esbuild-register/dist/node.js');
  unregister = register({ format: 'cjs', target: 'es2020' });
  requireCjs = createRequire(import.meta.url);
} catch {
  console.error("Missing dependency 'esbuild-register'. Install with: npm i -D esbuild-register");
  process.exit(2);
}

// ---------- CLI ----------
const args = parseArgs(process.argv.slice(2));
const rootDir = path.resolve(args.root ?? process.cwd());
const pattern = args.pattern ?? '**/*.module.css';
const tsVarsPath = args.vars ? path.resolve(args.vars) : null;
const noFail = Boolean(args['no-fail']);
// --link: auto | vscode | jetbrains | file
const linkMode = (args.link ?? 'auto').toLowerCase();

if (!tsVarsPath) {
  console.error('Error: --vars <path/to/file.ts> is required.');
  cleanupAndExit(2);
}

// ---------- load TS vars ----------
let validKeys;
try {
  const loaded = requireCjs(tsVarsPath);
  const mod = loaded && loaded.__esModule ? loaded : { default: loaded, ...loaded };
  validKeys = collectKeysFromModule(mod);
  if (!validKeys.size) {
    console.error(`No keys found in ${tsVarsPath}.`);
    cleanupAndExit(2);
  }
} catch (e) {
  console.error(`Failed to import TS vars from: ${tsVarsPath}`);
  console.error(e);
  cleanupAndExit(2);
}

// ---------- scan CSS ----------
const files = await fg(pattern, { cwd: rootDir, absolute: true, dot: false });
if (!files.length) {
  console.log(`No CSS files matched "${pattern}" under ${rootDir}`);
  cleanupAndExit(0);
}

// only check vars that start with --TEMP-
const varUseRe = /var\(\s*(--TEMP-[A-Za-z0-9_-]+)\s*(?:,[^)]+)?\)/g;
// report: filePath -> Array<{var: string, line: number, col: number}>
const report = new Map();

for (const abs of files) {
  const css = await fs.readFile(abs, 'utf8');
  const lineStarts = [0];
  for (let i = 0; i < css.length; i++) if (css.charCodeAt(i) === 10) lineStarts.push(i + 1);

  const missing = [];
  let match;
  while ((match = varUseRe.exec(css)) !== null) {
    const used = match[1];
    const bare = used.slice(2);
    const idx = match.index + match[0].indexOf(used);
    const line = upperBound(lineStarts, idx);
    const col = idx - lineStarts[line - 1] + 1;

    if (!validKeys.has(used) && !validKeys.has(bare)) {
      missing.push({ var: used, line, col });
    }
  }
  if (missing.length) report.set(abs, missing);
}

// ---------- output ----------
if (!report.size) {
  console.log('✅ All --TEMP-* CSS variables are defined in your TS variable list.');
  cleanupAndExit(0);
}

const resolvedMode = resolveLinkMode(linkMode);

console.log('❌ Missing CSS variables found:\n');
let totalMissing = 0;

for (const [filePath, occs] of report.entries()) {
  const rel = path.relative(rootDir, filePath);
  console.log(`• ${rel}`);
  occs.sort((a, b) => a.line - b.line || a.col - b.col);
  for (const o of occs) {
    totalMissing++;
    const url = toEditorUrl(filePath, o.line, o.col, resolvedMode);
    // Render a clean hyperlink with OSC 8; fallback prints compact path if OSC 8 unsupported
    console.log(`    ${hyperlink(o.var, url)}  (${path.basename(filePath)}:${o.line}:${o.col})`);
  }
}

console.log('\nSummary:');
console.log(`  Files with issues: ${report.size}`);
console.log(`  Total missing variables: ${totalMissing}`);

cleanupAndExit(noFail ? 0 : 1);

// ---------- helpers ----------
function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const next = argv[i + 1];
      if (!next || next.startsWith('--')) out[key] = true;
      else {
        out[key] = next;
        i++;
      }
    }
  }
  return out;
}

function collectKeysFromModule(mod) {
  const keySet = new Set();
  const values = Object.values(mod ?? {});
  for (const val of values) collectKeysFromAny(val, keySet, 0);
  return keySet;
}

function collectKeysFromAny(val, set, depth) {
  if (val == null || depth > 10) return;
  if (Array.isArray(val)) {
    val.forEach((v) => collectKeysFromAny(v, set, depth + 1));
    return;
  }
  if (typeof val === 'object') {
    for (const [k, v] of Object.entries(val)) {
      if (typeof v === 'string') addKeyVariants(set, k);
      else collectKeysFromAny(v, set, depth + 1);
    }
  }
}

function addKeyVariants(set, k) {
  if (typeof k !== 'string') return;
  if (k.startsWith('--')) {
    set.add(k);
    set.add(k.slice(2));
  } else {
    set.add(k);
    set.add(`--${k}`);
  }
}

function upperBound(lineStarts, pos) {
  let lo = 0,
    hi = lineStarts.length;
  while (lo + 1 < hi) {
    const mid = (lo + hi) >>> 1;
    if (lineStarts[mid] <= pos) lo = mid;
    else hi = mid;
  }
  return lo + 1; // 1-based
}

// Determine the best link scheme based on environment / flag
function resolveLinkMode(mode) {
  if (mode === 'vscode' || mode === 'jetbrains' || mode === 'file') return mode;
  // auto-detect
  const tp = (process.env.TERM_PROGRAM || '').toLowerCase();
  if (tp.includes('vscode')) return 'vscode';
  if (process.env.JB_RUNNING_IN_IDE === 'true') return 'jetbrains';
  return 'vscode'; // sane default; works in VS Code/ Cursor/ VSCodium
}

// Build a URL editors understand for jumping to line/column
function toEditorUrl(absPath, line, col, mode) {
  const p = path.resolve(absPath);
  if (mode === 'vscode') {
    // VS Code/ VSCodium/ Cursor
    return encodeURI(`vscode://file/${p}:${line}:${col}`);
  }
  if (mode === 'jetbrains') {
    // JetBrains IDE Protocol (enable "IDE Protocol" in settings)
    const q = new URLSearchParams({ file: p, line: String(line), column: String(col) });
    return `idea://open?${q.toString()}`;
  }
  // Fallback to plain file URL (won't jump to line, but still opens)
  return encodeURI(`file://${p}`);
}

// OSC 8 hyperlink wrapper (clean clickable text in capable terminals)
function hyperlink(text, url) {
  // If not a TTY or URL missing, just return the text + URL compactly
  if (!process.stdout.isTTY || !url) return `${text} ${url ? `<${url}>` : ''}`;
  const OSC = '\u001B]';
  const SEP = ';';
  const BEL = '\u0007';
  const CSI = '\u001B\\';
  // Some terminals prefer ST (\u001B\) over BEL; we'll emit BEL for start, ST for end for broad support
  return `${OSC}8${SEP}${SEP}${url}${BEL}${text}${OSC}8${SEP}${SEP}${CSI}`;
}

function cleanupAndExit(code) {
  try {
    unregister && unregister();
  } catch {
    // ignore
  }
  process.exit(code);
}
