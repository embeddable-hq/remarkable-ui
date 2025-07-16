## Architecture Overview

This project follows a modular, scalable architecture that separates reusable components, theming, internationalization, and internal scripts. The structure prioritizes **maintainability**, **extensibility**, and **clean integration**.

---

## Folder Structure

```
src
├── ready-made                      > includes charts and controls that are ready to use (not imported manually)
│   ├── charts                      > includes only charts
│   │   ├── PieChart
│   │   │   ├── PieChart.emb.ts     > chart configuration file
│   │   │   └── index.ts            > chart component default export
│   │   └── ...
│   │
│   └── controls                    > includes only controls
│       ├── DatePicker
│       │   ├── DatePicker.emb.ts   > control configuration file
│       │   └── index.ts            > control component default export
│       └── ...
│
├── components                      > components used to build the library (users can import and build ready-made components with them)
│   ├── charts                      > components that are charts
│   │   ├── PieChart
│   │   │   ├── sub-components      > internal sub-components (optional)
│   │   │   ├── PieChart.story.ts
│   │   │   ├── PieChart.test.ts
│   │   │   ├── PieChart.types.ts
│   │   │   ├── PieChart.utils.ts
│   │   │   ├── PieChart.styles.ts
│   │   │   ├── PieChart.ts
│   │   │   └── index.ts
│   │   └── ...
│   │
│   ├── controls                    > form/interaction components (e.g., selectors, inputs)
│   │   ├── DatePicker              > same structure as charts
│   │   │   ├── sub-components
│   │   │   ├── DatePicker.story.ts
│   │   │   ├── DatePicker.test.ts
│   │   │   ├── DatePicker.types.ts
│   │   │   ├── DatePicker.utils.ts
│   │   │   ├── DatePicker.styles.ts
│   │   │   ├── DatePicker.ts
│   │   │   └── index.ts
│   │   └── ...
│   │
│   └── shared                      > reusable components across charts and controls
│       ├── Button
│       │   ├── Button.story.ts
│       │   ├── Button.test.ts
│       │   ├── Button.types.ts
│       │   ├── Button.styles.ts
│       │   ├── Button.ts
│       │   └── index.ts
│       └── ...
│
├── theme
│   ├── theme.types.ts
│   ├── theme.constants.ts
│   ├── theme.ts
│   └── index.ts
│
├── i18n
│   ├── translations
│   │   ├── en.ts
│   │   ├── de.ts
│   │   └── ...
│   ├── i18n.types.ts
│   ├── i18n.constants.ts
│   ├── i18n.hook.ts
│   └── index.ts
│
├── utils                           > reusable helpers across components
│   ├── debounce.utils.test.ts
│   ├── debounce.utils.ts
│   ├── css.utils.test.ts
│   ├── css.utils.ts
│   ├── index.ts
│   └── ...
│
├── types                           > global types shared across the app
│
├── scripts
│   └── generate-exports.ts         > generates root-level exports (excludes `ready-made`)
│
├── embeddable.theme.ts             > default theme using `/theme` properties
├── embeddable.config.ts            > main embeddable config
├── lifecycle.config.ts             > hook for applying theme updates to the DOM and others
├── index.ts                        > auto-generated entry file (see Export Policy below)
├── tsconfig.json
├── eslintrc.js
├── prettier.config.js
├── package.json
├── ARCHITECTURE.md
└── README.md
```

---

## ready-made

Contains **pre-configured charts and controls**, ready to use out of the box. These are **not intended for direct import** when building custom UI.

- `charts`: Pre-built chart components (e.g., `PieChart`)
- `controls`: Pre-built control components (e.g., `DatePicker`)

Each includes:

- `.emb.ts`: Configuration file (inputs + `defineComponent`)
- `index.ts`: Default export for the React component

---

## components

Core components of the system, split by category:

- `charts`: Reusable chart components
- `controls`: Reusable control components
- `shared`: Shared components used by charts and controls

Each component may include:

- `.ts`: Main component file
- `.story.ts`: Storybook file
- `.test.ts`: Unit tests
- `.types.ts`: Local types (if needed)
- `.utils.ts`: Local utilities (if needed)
- `.styles.ts`: Component-specific styling
- `sub-components/`: Folder for complex component internals
- `index.ts`: Public export file

---

## theme

Theme management for components.

- `theme.types.ts`: Types for themes
- `theme.constants.ts`: Constants like `defaultTheme`
- `theme.ts`: Theme configuration
- `index.ts`: Public export file

---

## i18n

Handles internationalization logic.

- `translations`: Folder including all the translation files (`en.ts`, `de.ts`, etc.)
- `i18n.types.ts`: Shared i18n-related types
- `i18n.constants.ts`: Constants like `defaultI18nTheme`
- `i18n.hook.ts`: React hook for usage
- `index.ts`: Public export file

---

## utils

General-purpose utility functions shared across the codebase.

Each file may have:

- `.utils.ts`: Utility function(s)
- `.utils.test.ts`: Tests for the utility

All exposed via:

- `index.ts`: Central export file

---

## types

Contains shared **global types** for the project.

> **Note:** Component-specific types should live **inside the component** itself (`*.types.ts`), not in this folder.

---

## scripts

Project automation or tooling logic.

- `generate-exports.ts`: Scans and auto-generates the root `index.ts` file, skipping `ready-made`.

---

## Export Policy

The root-level `index.ts` is **auto-generated** by `scripts/generate-exports.ts`. This file defines the **public API** of the library.

What gets exported:

✅ `components`, `theme`, `i18n`, `utils`, `types`
🚫 `ready-made` (internal use only)

---

## Testing & Storybook

Every component in `components` should have:

- A `.test.ts` file for unit tests
- A `.story.ts` file to showcase and visually test the component in Storybook

---

## Extending the Library

### Adding a new *ready-made* component

1. Create a folder in `ready-made/charts` or `ready-made/controls`
2. Add:
   - A `*.emb.ts` config file
   - An `index.ts` with the default export

---

### Adding a new *reusable* component

1. Create a folder in `components/charts`, `components/controls`, or `components/shared`
2. Add:
   - `Component.ts`
   - `Component.test.ts`
   - `Component.story.ts`
   - (Optional) `Component.types.ts`, `Component.styles.ts`, etc.
3. Update `index.ts` inside the folder
4. Run: `yarn ts-node scripts/generate-exports.ts`

---

## Best Practices

- Use strong typing with TypeScript across all files
- Centralize exports through each folder’s `index.ts`
- Maintain consistent folder and file naming
- Keep `ready-made` isolated and non-exported
- Run the export script after adding or renaming components

