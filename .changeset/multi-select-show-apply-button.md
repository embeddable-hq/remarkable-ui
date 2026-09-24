---
'@embeddable.com/remarkable-ui': minor
---

Add a showApplyButton prop to MultiSelectField (default true). When false, the apply button is hidden and every checkbox toggle (including select/deselect all) commits immediately via onChange, with the dropdown staying open; the search resets when the dropdown closes, since there is no apply step to do it.
