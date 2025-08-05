import { Theme } from './theme';
import { ThemeStylesKeys } from './theme.constants';

const generateCssVariables = (variables: Record<string, string>) => {
  let textContent = '';
  Object.keys(variables).forEach((key) => {
    const value = variables[key];
    textContent += `${key}: ${value};\n`;
  });
  return textContent;
};

export const injectCssVariables = (newTheme: Theme) => {
  const css = `:root {\n${generateCssVariables(newTheme.styles)}}`;
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

const getStyleValue = (variableName: ThemeStylesKeys): string => {
  const computedStyle = getComputedStyle(document.documentElement);
  return computedStyle.getPropertyValue(variableName).trim();
};

export const getStyle = (variableName: ThemeStylesKeys): string => {
  const rawValue = getStyleValue(variableName);
  if (!rawValue) return rawValue;

  // colors (#…, rgb(, rgba()
  const firstChar = rawValue.charAt(0);
  if (firstChar === '#' || rawValue.startsWith('rgb(') || rawValue.startsWith('rgba(')) {
    return rawValue;
  }

  // others like font-family
  return rawValue;
};

export const getStyleNumber = (variableName: ThemeStylesKeys): number | undefined => {
  const rawValue = getStyleValue(variableName);

  if (!rawValue) return undefined;

  const numericValue = parseFloat(rawValue);
  const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);

  // “px”?
  if (rawValue.slice(-2) === 'px') {
    return numericValue;
  }

  // “rem” or “em”?
  const unit3 = rawValue.slice(-3);
  if (unit3 === 'rem' || unit3 === 'em') {
    return numericValue * rootFontSize;
  }

  // pure number
  if (numericRegex.test(rawValue)) {
    return numericValue;
  }
  return undefined;
};
