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
export function getCSSValue(variableName: string): string | number {
  const rawValue = getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();

  // Early exit if it's empty
  if (!rawValue) return rawValue;

  // 1) rem -> convert to px
  if (/^-?\d+(\.\d+)?rem$/.test(rawValue)) {
    const remValue = parseFloat(rawValue);
    const rootFontSize = parseFloat(getComputedStyle(document.documentElement).fontSize);
    return remValue * rootFontSize;
  }

  // 2) px -> parse as number
  if (/^-?\d+(\.\d+)?px$/.test(rawValue)) {
    return parseFloat(rawValue);
  }

  // 3) Purely numeric -> parse as float
  //    (e.g. "16", "1.25", or negative "-5")
  if (/^-?\d+(\.\d+)?$/.test(rawValue)) {
    return parseFloat(rawValue);
  }

  // 4) If it looks like a hex color (#abc, #abcdef, etc.), return as string
  if (/^#[0-9A-Fa-f]{3,8}$/.test(rawValue)) {
    return rawValue;
  }

  // 5) If it's rgb() or rgba(), treat as a color string
  if (/^rgb(a?)\(/.test(rawValue)) {
    return rawValue;
  }

  // Otherwise, return the raw string
  return rawValue;
}