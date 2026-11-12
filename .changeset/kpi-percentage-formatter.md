---
'@embeddable.com/remarkable-ui': minor
---

Add `percentageFormatter` to `KpiChart`, so the change badge can format its percentage for a locale (`+7,4 %` in German) instead of always using `toFixed` and a trailing `%`. Without it, output is unchanged.
