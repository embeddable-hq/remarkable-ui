# Remarkable UI

**Remarkable UI** is an open-source library of **beautiful components** for analytics – charts, controls, tables, and more – designed to be styled with **granular CSS variables**.

👉 Remarkable UI forms part of the [Embeddable](https://embeddable.com) ecosystem but can also be used independently.

## 🎨 Styling with CSS Variables

Every part of a Remarkable UI component can be styled with granular CSS variables.

There are **three layers** of variables in our system:

1. **Base variables**
   – Raw CSS primitives (colors, spacing, type scales)  
   – _Don’t override_—they’re the foundation.
2. **Semantic variables**  
   – “Meaningful” tokens built from base vars (e.g. --background-default, --foreground-error, --font-default)  
   – Control _global_ look-and-feel: light vs. dark palettes, brand colors, default text styles.
3. **Component variables**  
   – Element-specific tokens (namespaced by component, e.g. --icn-btn-background-hover, --dropdown-padding)  
   – Fine-tune individual components without touching global semantics.

## 🛠 Contributing

Remarkable UI is under active development, and we’d love feedback or contributions.  
Feel free to open issues or suggest improvements.
