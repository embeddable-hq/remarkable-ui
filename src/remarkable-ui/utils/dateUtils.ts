export function forceUtc(date: Date): Date {
	// getTimezoneOffset() is “minutes to add to local → UTC”
	const offsetMs = date.getTimezoneOffset() * 60_000;
	// subtracting that offset “undoes” the browser’s shift
	return new Date(date.getTime() - offsetMs);
}
