import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import * as esbuild from 'esbuild';
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts', // full package
    styles: 'src/styles/index.ts', // 👈 new entry
  },
  format: ['esm'], // ESM-only
  dts: true, // generate dist/index.d.ts
  sourcemap: true,
  clean: true,
  splitting: true, // code-splitting ESM chunks
  target: 'es2022',

  // We don't want to bundle React, chart.js, etc.
  external: [
    'react',
    'react-dom',
    '@radix-ui/react-dropdown-menu',
    '@tabler/icons-react',
    'chart.js',
    'chartjs-plugin-annotation',
    'chartjs-plugin-datalabels',
    'clsx',
    'mergician',
    'react-chartjs-2',
  ],

  // Let bundlers (CRA, Vite, Embeddable) handle CSS modules
  loader: {
    '.css': 'copy', // keep `import "./x.css"` in output, copy file to dist
  },

  // Copy and minify global.css to dist for package export "./global.css"
  onSuccess: async () => {
    const cwd = process.cwd();
    const css = readFileSync(join(cwd, 'src/styles/global.css'), 'utf8');
    const result = await esbuild.transform(css, {
      loader: 'css',
      minify: true,
    });
    writeFileSync(join(cwd, 'dist/global.css'), result.code, 'utf8');
  },
});
