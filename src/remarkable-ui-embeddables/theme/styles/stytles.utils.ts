const colorsMap = new Map<string, Map<string, string>>();
const colorsInUse = new Map<string, Set<string>>();

/*We save the colors to local storage so that they are persistent across refreshes. 
This is important, for example, if the user is looking at multiple tabs, or if the user refreshes the page.*/

const STORAGE_KEY = 'embeddable';

const saveColorsMap = () => {
  const obj: Record<string, Record<string, string>> = {};
  for (const [cat, m] of colorsMap) {
    obj[cat] = Object.fromEntries(m);
  }
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
};

const loadColorMap = () => {
  const data = sessionStorage.getItem(STORAGE_KEY);
  if (!data) return;
  const obj: Record<string, Record<string, string>> = JSON.parse(data);
  for (const cat in obj) {
    const m = new Map(Object.entries(obj[cat] ?? {}));
    colorsMap.set(cat, m);
    colorsInUse.set(cat, new Set(m.values()));
  }
};

loadColorMap();

export const getColor = (
  value: string,
  palette: string[],
  idx: number,
  category = 'global',
): string => {
  // Initialize structures if needed
  if (!colorsMap.has(category)) {
    colorsMap.set(category, new Map());
    colorsInUse.set(category, new Set());
  }

  const catMap = colorsMap.get(category)!;
  const catcolorsInUse = colorsInUse.get(category)!;

  // Return existing color if already assigned
  if (catMap.has(value)) return catMap.get(value)!;

  // Find first uncolorsInUse color, fallback to indexed one
  const color = palette.find((c) => !catcolorsInUse.has(c)) ?? palette[idx % palette.length];

  if (typeof color !== 'string') {
    throw new Error('No valid color found in palette');
  }

  // Save mapping and mark as colorsInUse
  catMap.set(value, color);
  catcolorsInUse.add(color);
  saveColorsMap();

  return color;
};
