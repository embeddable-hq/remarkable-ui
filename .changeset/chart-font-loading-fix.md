---
'@embeddable.com/remarkable-ui': patch
---

Fix chart axis labels being clipped when the theme's web font loads after the chart's first draw.

Charts measured their labels with fallback font metrics, and Chart.js cached those measurements. All charts (bar, line, pie, donut, scatter, bubble, funnel) now request their theme fonts up front and re-measure and redraw once the fonts finish loading.
