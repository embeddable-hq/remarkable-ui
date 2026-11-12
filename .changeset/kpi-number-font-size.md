---
'@embeddable.com/remarkable-ui': patch
---

Fix the KPI number ignoring auto-sizing when the host page styles `h2` globally (e.g. `h2 { font-size: 1.5rem }`). The number now takes `--em-kpichart-number-font-size` (2rem by default) until AutoTextSize fits it, or `valueFontSize` when set.
