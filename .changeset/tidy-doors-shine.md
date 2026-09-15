---
'@embeddable.com/remarkable-ui': minor
---

Add Lightbox: a modal surface rendered in the browser's top layer via dialog.showModal(), so it escapes transformed/contained ancestors and shadow roots. Themeable via --em-lightbox-width/height/max-width/max-height and --em-lightbox-backdrop-background. Also fix useResizeObserver to re-attach when the ref points at a new element, and guard getTableTotalPages against a zero page size.
