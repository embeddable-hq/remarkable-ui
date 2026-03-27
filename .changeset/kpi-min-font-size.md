---
"@embeddable.com/remarkable-ui": patch
---

fix(kpi): prevent KPI font from resizing to invisible

Set a minimum font size of 12px on the KPI chart auto-resize to ensure the value is always readable. Previously the font could shrink to 1px, making it effectively invisible. At the minimum size the existing ellipsis overflow CSS truncates gracefully instead.

