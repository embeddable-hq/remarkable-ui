const EMBEDDABLE_OVERLAY_ATTR = 'embeddable-radix-overlays';
const MAX_Z_INDEX = 2147483647;

export const getOrCreateTooltipOverlayContainer = (): HTMLElement | null => {
  if (typeof document === 'undefined') return null;

  let el = document.querySelector<HTMLElement>(`[${EMBEDDABLE_OVERLAY_ATTR}]`);
  if (el) return el;

  el = document.createElement('div');
  el.setAttribute(EMBEDDABLE_OVERLAY_ATTR, 'true');

  // Positioning / stacking
  el.style.position = 'fixed';
  el.style.inset = '0';
  el.style.pointerEvents = 'none';
  el.style.zIndex = MAX_Z_INDEX.toString();

  document.body.appendChild(el);

  return el;
};

export const tooltipContentStyle = {
  zIndex: 5,
  padding:
    'var(--em-tooltip-padding-top-bottom, 0.375rem) var(--em-tooltip-padding-left-right, 0.5rem)',
  borderRadius: 'var(--em-tooltip-border-radius, 0.375rem)',
  background: 'var(--em-tooltip-background, #212129)',
  color: 'var(--em-tooltip-color, #fff)',
  fontFamily: 'var(--em-tooltip-font-family, sans-serif)',
  fontSize: 'var(--em-tooltip-font-size, 0.75rem)',
  fontWeight: 'var(--em-tooltip-font-weight, 700)',
  lineHeight: 'var(--em-tooltip-line-height, 0.875rem)',
  maxWidth: 'var(--em-tooltip-max-width, 16rem)',
};
