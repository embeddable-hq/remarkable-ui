import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import css from "@eslint/css";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // Base JavaScript rules for all JS/TS files
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: { js },
    extends: ["js/recommended"],
  },

  // Define browser globals for JS/TS files
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: { globals: globals.browser },
  },

  // Recommended TypeScript ESLint rules
  ...tseslint.configs.recommended,

  // React-specific linting for TSX files
  {
    files: ["**/*.{tsx}"],
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: "detect", // Automatically detect React version
      },
    },
  },

  // React Hooks rules for TS and TSX files
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      "react-hooks/rules-of-hooks": "error", // Enforce rules of hooks
      "react-hooks/exhaustive-deps": "warn", // Warn about missing deps in useEffect
    },
  },

  // CSS linting for .css files
  {
    files: ["**/*.css"],
    plugins: { css },
    language: "css/css",
    extends: ["css/recommended"],
  },

  // Disallow JS and JSX files inside src directory (use TS/TSX only)
  {
    files: ["src/**/*.{js,jsx}"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "Program",
          message:
            "JS and JSX files are not allowed inside src; use only TS and TSX.",
        },
      ],
    },
  },
]);
