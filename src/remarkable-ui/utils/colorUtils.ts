// Local Libraries
import { Theme } from '../../themes/remarkableTheme/theme';

const colorMap = new Map<string,string>();
const used = new Set<string>();

export function getColor(
  value: string,
  palette: string[],
  idx: number
): string {
  if (colorMap.has(value)) return colorMap.get(value)!;

  const pick = palette.find(c => !used.has(c))
        ?? palette[idx % palette.length];

  colorMap.set(value, pick);
  used.add(pick);
  return pick;
}


