import js from '@eslint/js';
import css from '@eslint/css';
import configPrettier from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import storybook from 'eslint-plugin-storybook';
import tseslint from 'typescript-eslint';

export default defineConfig([
  // Base JavaScript rules for all JS/TS files
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: { js },
    extends: ['js/recommended'],
  },

  // Define browser globals for JS/TS files
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    languageOptions: { globals: globals.browser },
  },

  // Recommended TypeScript ESLint rules
  ...tseslint.configs.recommended,

  // React-specific linting for TSX files
  {
    files: ['**/*.tsx'],
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: 'detect', // Automatically detect React version
      },
    },
  },
  // React Hooks rules for TS and TSX files
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      'react-hooks': reactHooks,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error', // Enforce rules of hooks
      'react-hooks/exhaustive-deps': 'warn', // Warn about missing deps in useEffect
      'react/react-in-jsx-scope': 0,
      'react/prop-types': 'off',
    },
  },

  // CSS linting for .css files
  {
    files: ['**/*.css'],
    plugins: { css },
    language: 'css/css',
    extends: ['css/recommended'],
    rules: {
      'css/no-invalid-properties': ['error', { allowUnknownVariables: true }], // Allow unknown CSS custom properties (e.g. --font-default)
      'css/use-baseline': 'off',
    },
  },

  // Disallow JS and JSX files inside src directory (use TS/TSX only)
  {
    files: ['src/**/*.{js,jsx}'],
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Program',
          message: 'JS and JSX files are not allowed inside src; use only TS and TSX.',
        },
      ],
    },
  },

  // Node scripts (CJS/JS in scripts/)
  {
    files: ['scripts/**/*.{js,cjs,mjs}'],
    languageOptions: {
      globals: globals.node,
      sourceType: 'script',
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-var-requires': 'off',
    },
  },

  // Prettier integration
  configPrettier,

  // Storybook
  ...storybook.configs['flat/recommended'],

  // Ignore
  globalIgnores([
    '.embeddable',
    '.embeddable-dev-build',
    '.embeddable-dev-tmp',
    '.embeddable-build',
    '.embeddable-tmp',
    'storybook-static',
    'dist',
    'node_modules',
    '**/*.d.ts',
  ]),
]);
