---
'@embeddable.com/remarkable-ui': minor
---

Add an autoApply prop to MultiSelectField (default false). When true, the apply button is hidden and every checkbox toggle (including select/deselect all) commits immediately via onChange, with the dropdown staying open; the search resets when the dropdown closes, since there is no apply step to do it.
