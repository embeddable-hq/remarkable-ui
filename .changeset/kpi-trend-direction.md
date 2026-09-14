---
'@embeddable.com/remarkable-ui': minor
---

Allow the KPI trend arrow direction to be controlled independently of the positive/negative colors.

`KpiChart`/`KpiChartChange` gain a new optional `invertTrendDirection` prop, and `KpiTrend` gains a new optional `reverseColor` prop. Both default to mirroring the existing `invertChangeColors`/`reverseTrend` value, so current usages keep looking exactly the same until a consumer opts in to setting them independently.
