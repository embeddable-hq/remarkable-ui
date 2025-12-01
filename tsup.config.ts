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
    'chroma-js',
    'clsx',
    'dayjs',
    'dom-to-image-more',
    'i18next',
    'mergician',
    'react-chartjs-2',
    'xlsx',
  ],

  // Let bundlers (CRA, Vite, Embeddable) handle CSS modules
  loader: {
    '.css': 'copy', // keep `import "./x.css"` in output, copy file to dist
  },
});
