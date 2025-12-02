# Remarkable UI

[**Remarkable UI**](https://www.npmjs.com/package/@embeddable.com/remarkable-ui) is a library of beautiful analytics components—charts, controls, tables, and more—designed to be styled through **granular CSS variables**.

## 🎨 Styling System

Every aspect of a Remarkable UI component can be customized using granular CSS variables.

### CSS Variables Architecture

There are **three layers** of variables in our system:

1. **Core variables**
   - Raw CSS primitives (colors, spacing, type scale)

   - _Do not override_ — they serve as the foundation.

2. **Semantic variables**
   - Meaningful tokens built from core variables (e.g. `--em-sem-background`, `--em-sem-chart-color--1`, `--em-sem-text`)

   - Control the _global_ look and feel: palettes, brand colors, default typography.

3. **Component variables**
   - Component-specific tokens (e.g. `--em-card-border-radius`, `--em-card-subtitle-color`)

   - Fine-tune individual components without affecting global semantics.

## 📦 Installation & Usage

### Installation

```bash

npm install @embeddable.com/remarkable-ui
```

### CSS Setup

The library includes fallback values for all CSS variables, so you don't need to override anything unless you want to customize the theme.

To override styles, define the variables you want in your own CSS file:

```css
:root {
	...
	--em-card-background: "grey",
	...
}
```

Then import your CSS file at the root of your project:

```javascript
import 'your-file-here.css';
```

### Importing components

```ts
import { Button, Card } from '@embeddable.com/remarkable-ui';
```

## 📁 Project Structure

```
scripts/         # Automation scripts
src/
  components/    # Chart, editor and shared components
  hooks/         # Reusable hooks used by the components
  styles/        # Global css and types for the exising css variables
  types/         # Shared TypeScript types
  utils.ts/      # Utility functions
```

## 🛠 Contributing

We welcome feedback and contributions!

1.  Fork the repository
2.  Create a feature branch
3.  Commit your changes
4.  Open a pull request

Please follow our code style and include tests for any new features.

## 📄 License

MIT — see the `LICENSE` file for details.
