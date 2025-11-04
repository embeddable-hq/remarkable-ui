const generateCssVariables = (variables: Record<string, string>) => {
  let textContent = '';
  Object.keys(variables).forEach((key) => {
    const value = variables[key];
    textContent += `${key}: ${value};\n`;
  });
  return textContent;
};

// TODO: check the possibility of injecting via CSS (future)
export const injectCssVariables = (styles: Record<string, string>) => {
  const css = `:root {\n${generateCssVariables(styles)}}`;
  const styleId = 'remarkable-ui-embeddable-style';
  let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;

  if (styleEl) {
    // Overwrite the old vars
    styleEl.textContent = css;
  } else {
    styleEl = document.createElement('style');
    styleEl.id = styleId;
    styleEl.textContent = css;
    document.head.appendChild(styleEl);
  }

  return () => styleEl?.remove();
};

const colorsMap = new Map<string, Map<string, string>>();
const colorsInUse = new Map<string, Set<string>>();

/* 
We save the colors to session storage so that they are persistent across refreshes. 
This is important, for example, if the user is looking at multiple tabs, or if the user refreshes the page.
*/
const STORAGE_KEY = 'embeddable';

const saveColorsMap = () => {
  const obj: Record<string, Record<string, string>> = {};
  for (const [cat, m] of colorsMap) {
    obj[cat] = Object.fromEntries(m);
  }
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
};

const loadColorMap = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

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

export const getColor = (key: string, value: string, palette: string[], idx: number): string => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return '';

  // Initialize structures if needed
  if (!colorsMap.has(key)) {
    colorsMap.set(key, new Map());
    colorsInUse.set(key, new Set());
  }

  const catMap = colorsMap.get(key)!;

  // Return existing color if already assigned
  if (catMap.has(value)) return catMap.get(value)!;

  // Find first colorsInUse color, fallback to indexed one
  const color = palette[idx % palette.length];

  if (typeof color !== 'string') {
    throw new Error('No valid color found in palette');
  }

  // Save mapping and mark as colorsInUse
  catMap.set(value, color);
  saveColorsMap();

  return color;
};
