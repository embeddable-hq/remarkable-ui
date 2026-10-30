---
'@embeddable.com/remarkable-ui': minor
---

Give charts an accessible name and description (WCAG 1.1.1).

- Bar, line, pie, donut, scatter, bubble and funnel charts now expose a name and a generated text summary of their data (type, size, highest/lowest values, ranges) to assistive technology.
- The name comes from the new `ariaLabel` prop, else the title of the enclosing `Card`/`CardHeader`, else the chart type.
- The summary is generated in English; pass `ariaDescription` to supply your own (for example a translation).
