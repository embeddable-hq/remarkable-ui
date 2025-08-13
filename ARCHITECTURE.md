# Architecture Overview

This project follows a modular, scalable architecture that separates reusable components, theming, internationalization, and internal scripts. The structure prioritizes **maintainability**, **extensibility**, and **clean integration**.

Currently the remarkable-ui and remarkable-ui-embeddable belong to the same repo. In the future, remarkable-ui will be extracted into its own library.

# Remarkable UI Structure

```
src
├── charts                            > chart components
│   ├── PieChart                      > folder with the name of the component
│   │   ├── PieChart.ts               > react component
│   │   ├── PieChart.styles.ts        > styles of the component
│   │   ├── PieChart.utils.ts         > utils of the component
│   │   ├── PieChart.types.ts         > types of the component
│   │   ├── PieChart.tests.ts         > tests of the component
│   │   └── PieChart.stories.ts       > storybook of the component
│   ├── BarChart
│   │   └── ...                       > same as above (PieChart)
│   ├── ...
│   └── shared                     > shared components inside the charts
├── controls                      > control components
├── shared                        > shared components used between charts and controls. also used to build own components
├── styles                        > styles of the repo
│   ├── styles.constants.ts       > object with css variable to be injected
│   └── styles.utils.ts           > injecting css variables from TS
└── index.ts                      > exported types, constants, functions and components
```

# Remarkable UI Overview

This will be our component library, later to export as a individual npm package.

## Components

Components are separated into 3 sections:

1. `charts`: Reusable chart components
2. `controls`: Reusable control components
3. `shared`: Shared components used by charts and controls. Additionally includes components used to create other components.

## Styles

Styles include all the styling used by the components above and offers functionality to access those values via TS.

## Testing & Storybook

Every component should have:

- A `.test.ts` file for unit tests
- A `.story.ts` file to showcase and visually test the component in Storybook

## Adding a new component

1. Create a folder in `charts`, `controls`, or `shared`
2. Add:
   - `Component.ts`
   - `Component.test.ts`
   - `Component.story.ts`
   - (Optional) `Component.types.ts`, `Component.styles.ts`, etc.
3. Update `index.ts` of the root folder

## Best Practices

- Use strong typing with TypeScript across all files
- Centralize exports through each folder’s `index.ts`
- Maintain consistent folder and file naming

# Remarkable UI Embeddable Structure

```
src
├── components
│   ├── charts                                > chart components
│   │   ├── pies                              > component group name (only applies if component has multiple variants)
│   │   │   ├── PieChart                      > name of the component
│   │   │   │   ├── index.ts                  > react component
│   │   │   │   └── PieChart.emb.ts           > component configuration (inputs and initiation)
│   │   │   ├── DonutChart
│   │   │   │   ├── index.ts
│   │   │   │   └── DonutChart.emb.ts
│   │   │   └── DonutLabelChart
│   │   │       ├── index.ts
│   │   │       └── DonutLabelChart.emb.ts
│   │   ├── bars
│   │   │   └── ...
│   │   └── shared                            > components reused inside the charts
│   │       └── ChartCard.ts                  > react component
│   │           ├── ChartCard.story.ts        > storybook of the component > check need
│   │           ├── ChartCard.test.ts.        > tests of the component
│   │           ├── ChartCard.types.ts        > types of the component (only if more than one, including the DatePickerProps)
│   │           ├── ChartCard.utils.ts        > utils of the component
│   │           └── ChartCard.styles.ts       > styles of the component
│   └── controls                              > control components
│       ├──  DatePicker                       > name of the component
│       │   ├── DatePicker.story.ts
│       │   ├── DatePicker.test.ts.
│       │   ├── DatePicker.types.ts
│       │   ├── DatePicker.utils.ts
│       │   └── DatePicker.styles.ts
│       ├── ...
│       └── shared                            > components reused inside the control
├── theme                                     > theme functionality
│   ├── formatter                             > formatter of the theme
│   │   ├── formatter.constants.ts            > formatter default values
│   │   ├── formatter.types.ts
│   │   └── formatter.utils.ts
│   ├── i18n                                  > i18n
│   │   ├── translations                      > files supported
│   │   │   ├── en.ts
│   │   │   ├── de.ts
│   │   │   └── ...
│   │   └── i18n.ts                           > setup the i18n (singleton)
│   ├── styles                                > styles of the theme
│   │   ├── styles.constants.ts               > style default values
│   │   ├── styles.types.ts
│   │   └── styles.utils.ts
│   ├── utils                                 > theme utils
│   │   ├── export.utils.ts
│   │   └── ...
│   ├── theme.constants.ts                    > theme default values
│   └── theme.types.ts
├── assets
│   ├── icons
│   ├── fonts
│   └── ...
├── types                                     > overall types
├── embeddable.theme.ts                       > default theme using `/theme` properties
├── embeddable.config.ts                      > main embeddable config
├── lifecycle.config.ts                       > hook for applying theme updates to the DOM and others
├── tsconfig.json
├── eslintrc.js
├── prettier.config.js
├── package.json
├── ARCHITECTURE.md
└── README.md
```

Each component may include:

- `.ts`: Main component file
- `.story.ts`: Storybook file
- `.test.ts`: Unit tests
- `.types.ts`: Local types (if needed)
- `.utils.ts`: Local utilities (if needed)
- `.styles.ts`: Component-specific styling

---

---

# Remarkable UI Embeddable Overview

## Components

Contains **pre-configured charts and controls**, ready to use out of the box. These are **not intended for direct import** when building custom UI.

- `charts`: Pre-built chart components (e.g., `PieChart`)
- `controls`: Pre-built control components (e.g., `DatePicker`)

Each includes:

- `.emb.ts`: Configuration file (inputs + `defineComponent`)
- `index.ts`: Default export for the React component

---

## Theme

Theme is split into 4 parts:

1. `formatter`: controls how the data is displayed to the end user
2. `i18n`: controls how the labels are displayed to the end user
3. `styles`: styles functionality
4. `utils`: utils used by the theme

## Types

Contains shared **global types** for the project.

**Note:** Component-specific types should live **inside the component** itself (`*.types.ts`), not in this folder.

## Extending the Library

### Adding a new embeddable component

1. Create a folder in `charts` or `controls`
2. Add:
   - A `*.emb.ts` config file
   - An `index.ts` with the default export

## Best Practices

- Use strong typing with TypeScript across all files
- Maintain consistent folder and file naming
- Keep the `embeddable` components isolated and non-exported
