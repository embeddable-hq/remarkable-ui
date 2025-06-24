const colorMap = new Map<string, Map<string, string>>();
const used = new Map<string, Set<string>>();

/*We save the colors to local storage so that they are persistent across refreshes. 
This is important, for example, if the user is looking at multiple tabs, or if the user refreshes the page.*/

const STORAGE_KEY = 'dashboardColors';

function save() {
	const obj: Record<string, Record<string, string>> = {};
	for (const [cat, m] of colorMap) {
		obj[cat] = Object.fromEntries(m);
	}
	localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
}

function load() {
	const data = localStorage.getItem(STORAGE_KEY);
	if (!data) return;
	const obj: Record<string, Record<string, string>> = JSON.parse(data);
	for (const cat in obj) {
		const m = new Map(Object.entries(obj[cat]));
		colorMap.set(cat, m);
		used.set(cat, new Set(m.values()));
	}
}
load();

export function getColor(value: string, palette: string[], idx: number, category?: string): string {
	const cat = category ?? 'global';

	// 1) ensure inner Map & Set exist
	if (!colorMap.has(cat)) {
		colorMap.set(cat, new Map());
		used.set(cat, new Set());
	}

	const catMap = colorMap.get(cat)!;
	const catUsed = used.get(cat)!;

	// 2) return existing color if already assigned
	if (catMap.has(value)) {
		return catMap.get(value)!;
	}

	// 3) Otherwise, pick a new color
	const pick = palette.find((c) => !catUsed.has(c)) ?? palette[idx % palette.length];

	// 4) store & mark used
	catMap.set(value, pick);
	catUsed.add(pick);
	save();
	return pick;
}
