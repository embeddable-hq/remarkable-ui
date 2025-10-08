import { StylesKeys } from './styles.constants';

/**
 * Attempts to interpret a CSS variable as a number (for lengths)
 * or a string (for colors, etc.).
 *
 * Examples:
 * --var: 2rem  -> returns number (px)
 * --var: 16px  -> returns number
 * --var: 3     -> returns number (parsed float)
 * --var: #3498db -> returns string
 * --var: rgba(52, 152, 219, 0.8) -> returns string
 */
const numericRegex = /^-?\d+(\.\d+)?$/;

const getStyleValue = (variableName: StylesKeys): string => {
  const computedStyle = getComputedStyle(document.documentElement);
  return computedStyle.getPropertyValue(variableName).trim();
};

export const getStyle = (variableName: StylesKeys): string => {
  const rawValue = getStyleValue(variableName);
  if (!rawValue) return rawValue;

  // Colors
  const firstChar = rawValue.charAt(0);
  if (firstChar === '#' || rawValue.startsWith('rgb(') || rawValue.startsWith('rgba(')) {
    return rawValue;
  }

  // Others like font-family
  return rawValue;
};

export const getStyleNumber = (variableName: StylesKeys): number | undefined => {
  const rawValue = getStyleValue(variableName);

  if (!rawValue) return undefined;

  const numericValue = parseFloat(rawValue);
  const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);

  // Px
  if (rawValue.slice(-2) === 'px') {
    return numericValue;
  }

  // Rem/Em
  const unit3 = rawValue.slice(-3);
  if (unit3 === 'rem') {
    return numericValue * rootFontSize;
  }

  // Pure number
  if (numericRegex.test(rawValue)) {
    return numericValue;
  }
  return undefined;
};

export const isValidColor = (value: string) => {
  const s = new Option().style;
  s.color = '';
  s.color = value;
  return s.color !== '';
};

export const colorWithOpacity = (color: string, opacity = 0.2): string => {
  // HEX colors (#RGB or #RRGGBB)
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    const bigint = parseInt(
      hex.length === 3
        ? hex
            .split('')
            .map((x) => x + x)
            .join('')
        : hex,
      16,
    );
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  // rgb() or rgba(), supports commas or spaces and optional alpha
  const rgbMatch = color.match(/rgba?\(\s*(\d+)[ ,]+(\d+)[ ,]+(\d+)(?:[ ,/]+([0-9.]+))?\s*\)/);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]!, 10);
    const g = parseInt(rgbMatch[2]!, 10);
    const b = parseInt(rgbMatch[3]!, 10);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  // Named CSS colors
  try {
    const div = document.createElement('div');
    div.style.color = color;
    document.body.appendChild(div);
    const computed = getComputedStyle(div).color; // e.g. "rgb(255, 0, 0)"
    document.body.removeChild(div);

    const match = computed.match(/rgb\((\d+), (\d+), (\d+)\)/);
    if (match) {
      const r = parseInt(match[1]!, 10);
      const g = parseInt(match[2]!, 10);
      const b = parseInt(match[3]!, 10);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
  } catch {
    // ignore
  }

  // fallback
  return color;
};
