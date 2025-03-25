export function getCSSValue(variableName: string): string | number {
  // Get the raw CSS variable value from :root
  const rawValue = getComputedStyle(document.documentElement)
    .getPropertyValue(variableName)
    .trim();

  // If the value is in rem units, convert to pixels
  if (rawValue.endsWith('rem')) {
    const remValue = parseFloat(rawValue);
    const rootFontSize = parseFloat(
      getComputedStyle(document.documentElement).fontSize
    );
    return remValue * rootFontSize;
  }

  // Otherwise, return the raw value (e.g., a hex code)
  return rawValue;
}