---
'@embeddable.com/remarkable-ui': patch
---

Fix `KpiChart`/`KpiChartChange` mishandling a `null` comparison value.

A `null` previous-period value could be indistinguishable from a real `0`, or silently coerced to `0` in the change calculation, depending on settings. Now a `null` `comparisonValue` always shows the "no previous data" label, a real `0` is treated as real data, and a `0` comparisonValue in percentage mode falls back to the absolute difference instead of rendering `Infinity%`.
