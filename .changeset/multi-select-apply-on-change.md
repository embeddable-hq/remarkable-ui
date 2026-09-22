---
'@embeddable.com/remarkable-ui': minor
---

Add an `applyOnChange` prop to MultiSelectField: every tick, untick and select all calls `onChange` straight away and the Apply button is left out. Off by default, so existing fields keep the Apply step.
