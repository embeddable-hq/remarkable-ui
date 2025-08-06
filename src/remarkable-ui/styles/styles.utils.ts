import { StylesKeys } from './styles.constants';

const generateCssVariables = (variables: Record<string, string>) => {
  let textContent = '';
  Object.keys(variables).forEach((key) => {
    const value = variables[key];
    textContent += `${key}: ${value};\n`;
  });
  return textContent;
};

// TODO: check the possibility of injecting via CSS
export const injectCssVariables = (styles: Record<string, string>) => {
  const css = `:root {\n${generateCssVariables(styles)}}`;
  const styleId = 'embeddable-style';
  let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;

  if (styleEl) {
    // overwrite the old vars
    styleEl.textContent = css;
  } else {
    styleEl = document.createElement('style');
    styleEl.id = styleId;
    styleEl.textContent = css;
    document.head.appendChild(styleEl);
  }

  return () => styleEl?.remove();
};

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
  if (unit3 === 'rem' || unit3 === 'em') {
    return numericValue * rootFontSize;
  }

  // Pure number
  if (numericRegex.test(rawValue)) {
    return numericValue;
  }
  return undefined;
};
