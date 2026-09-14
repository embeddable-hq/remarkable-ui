---
'@embeddable.com/remarkable-ui': minor
---

Allow the KPI trend arrow direction to be controlled independently of the positive/negative colors (TPS-1470).

`KpiChart`/`KpiChartChange` gain a new optional `reverseTrendDirection` prop, and `KpiTrend` gains a new optional `reverseColor` prop. Both default to mirroring the existing `invertChangeColors`/`reverseTrend` value, so current usages keep looking exactly the same until a consumer opts in to setting them independently.
