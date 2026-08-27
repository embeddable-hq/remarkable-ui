---
'@embeddable.com/remarkable-ui': patch
---

Add `--em-tabs-*` design tokens for page-level dashboard tab navigation, consumed by the `em-beddable-tabs` web component. 44 new tokens covering the tab strip (background, padding, gap, justification, bottom rail), tab items across resting/hover/active/disabled/keyboard-focus states (color, background, border, typography, letter-spacing, text-transform, opacity), the active indicator (height, color, radius, offset), and transition duration/easing.

This is a separate namespace from `--em-charttabs-*`, which styles inline tabs within a chart. Tokens only — no component ships with this change.
