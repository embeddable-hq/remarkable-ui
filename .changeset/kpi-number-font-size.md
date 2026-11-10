---
'@embeddable.com/remarkable-ui': patch
---

Fix the KPI number ignoring auto-sizing when the host page styles `h2` globally (e.g. `h2 { font-size: 1.5rem }`). The number now inherits its size from AutoTextSize, or from `valueFontSize` when set.
