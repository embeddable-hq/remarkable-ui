# Remarkable UI Library

**Remarkable UI** is a library of beautiful components for analytics – charts, controls, tables, and more – designed to be styled with **granular CSS variables**.

## 🎨 Styling System

Every part of a Remarkable UI component can be styled with granular CSS variables.

### CSS Variables Architecture

There are **three layers** of variables in our system:

1. **Base variables**
   – Raw CSS primitives (colors, spacing, type scales)  
   – _Don't override_—they're the foundation.
2. **Semantic variables**  
   – "Meaningful" tokens built from base vars (e.g. --background-default, --foreground-error, --font-default)  
   – Control _global_ look-and-feel: light vs. dark palettes, brand colors, default text styles.
3. **Component variables**  
   – Element-specific tokens (namespaced by component, e.g. --icn-btn-background-hover, --dropdown-padding)  
   – Fine-tune individual components without touching global semantics.

### CSS Variables Processing

CSS variables are defined in TypeScript for type safety and automatically processed during build:

- **Source**: `src/remarkable-ui/styles/styles.constants.ts` - TypeScript constants as single source of truth
- **Processing**: Automatically converted to CSS variables and merged into the main CSS file
- **Output**: All variables included in `dist/remarkable-ui.css` - no separate files needed

## 📦 Installation & Usage

### Basic Setup

```bash
npm install @embeddable.com/remarkable-ui
```

### CSS Setup

Import the main CSS file to get both CSS variables and component styles:

```javascript
// Import CSS variables and component styles (all-in-one)
import '@embeddable.com/remarkable-ui/dist/remarkable-ui.css';

// Import components
import { Button, Card } from '@embeddable.com/remarkable-ui';
```

**Note**: The CSS variables are automatically generated from TypeScript constants and merged into the main CSS file during the build process. No separate CSS variables file is needed.

## 🔧 Development

### Building the Package

To build the package with CSS variables included:

```bash
npm run embeddable:package
```

This command builds the component library and automatically processes the CSS variables from TypeScript constants into the final CSS file.

### Project Structure

```
src/remarkable-ui/
├── charts/           # Chart components (Bar, Pie, Donut)
├── editors/          # Form input components
├── shared/           # Reusable UI components
├── styles/           # CSS variables and styling utilities
│   ├── styles.constants.ts    # TypeScript CSS variables source
│   └── styles.utils.ts        # Styling helper functions
└── utils/            # Utility functions
```

## 🛠 Contributing

Remarkable UI is under active development, and we'd love feedback or contributions.  
Feel free to open issues or suggest improvements.
