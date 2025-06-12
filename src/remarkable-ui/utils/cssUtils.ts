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
const rootElement = document.documentElement;
const numericRegex = /^-?\d+(\.\d+)?$/;

export function getStyle(variableName: string): string | number {
	const computedStyle = getComputedStyle(rootElement);
	const rawValue = computedStyle.getPropertyValue(variableName).trim();
	if (!rawValue) return rawValue;

	const numericValue = parseFloat(rawValue);
	const rootFontSize = parseFloat(computedStyle.fontSize);

	// “px”?
	if (rawValue.slice(-2) === 'px') {
		return numericValue;
	}

	// “rem” or “em”?
	const unit3 = rawValue.slice(-3);
	if (unit3 === 'rem') {
		return numericValue * rootFontSize;
	}
	if (unit3 === 'em') {
		return numericValue * rootFontSize;
	}

	// pure number
	if (numericRegex.test(rawValue)) {
		return numericValue;
	}

	// colors (#…, rgb(, rgba()
	const firstChar = rawValue.charAt(0);
	if (firstChar === '#' || rawValue.startsWith('rgb(') || rawValue.startsWith('rgba(')) {
		return rawValue;
	}

	return rawValue;
}
