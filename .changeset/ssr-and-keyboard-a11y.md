---
'@embeddable.com/remarkable-ui': patch
---

Three fixes that change nothing in what a chart looks like:

- `getStyleNumber` no longer throws without a DOM (server rendering). It resolves `rem` against a 16px root there.
- The table cell copy button is visible while keyboard focus is in its cell, not only on hover.
- Clickable heat map cells have an accessible name (row, column and value), so they are named even when values are hidden.
