export function debounce<T extends (...args: any[]) => void>(
	fn: T,
	wait = 300,
): (...args: Parameters<T>) => void {
	let timer: ReturnType<typeof setTimeout>;
	return (...args: Parameters<T>) => {
		clearTimeout(timer);
		timer = setTimeout(() => fn(...args), wait);
	};
}
