// This is a workaround to force a date to be in UTC.
// It's used to ensure that the date is always in UTC, even if the browser is in a different timezone.
// This is useful because the date pickers are currently used in a timezone-agnostic way, and we want to ensure that the date is always in UTC.
// Example:
// const midnight = 2025-06-14T00:00:00+02:00;
// const midnightUtc = forceUtc(midnight);
// console.log(midnightUtc); // 2025-06-14T00:00:00.000Z

export function forceUtc(date: Date): Date {
	// getTimezoneOffset() is “minutes to add to local → UTC”
	const offsetMs = date.getTimezoneOffset() * 60_000;
	// subtracting that offset “undoes” the browser’s shift
	return new Date(date.getTime() - offsetMs);
}
