---
'@embeddable.com/remarkable-ui': minor
---

Improve accessibility of select and date-range filters (WCAG 2.1.1, 2.4.6, 4.1.2).

- Triggers are now named from the field's visible label plus the current value, instead of a hardcoded "Select option(s)". New `ariaLabel` prop covers fields without a visible label.
- Triggers expose `aria-required`, `aria-invalid` and `aria-describedby` (linked to the error message).
- The clear "x" is now a real, keyboard-focusable button with an accessible name (new `clearLabel` prop, default "Clear"), rendered as a sibling of the trigger rather than nested inside it. In the `ghost` variant it now sits after the caret.
