const colorMap = new Map<string, Map<string, string>>();
const used = new Map<string, Set<string>>();

export function getColor(
    value: string,
    palette: string[],
    idx: number,
    category?: string
  ): string {
    const cat = category ?? 'global';
  
    // 1) ensure inner Map & Set exist
    if (!colorMap.has(cat)) {
      colorMap.set(cat, new Map())
      used.set(cat, new Set())
    }
  
    const catMap = colorMap.get(cat)!
    const catUsed = used.get(cat)!
  
    // 2) return existing color if already assigned
    if (catMap.has(value)) {
      return catMap.get(value)!
    }
  
    // 3) Otherwise, pick a new color
    const pick =
      palette.find(c => !catUsed.has(c)) ??
      palette[idx % palette.length]
  
    // 4) store & mark used
    catMap.set(value, pick)
    catUsed.add(pick)

    console.log("colorMap", colorMap);
    console.log("used", used);
  
    return pick
  }



//todo: color(value: string, palette: color[], category: string)
//category could be a dimension, or a chart etc. 
//so need to cache based on palette and category.







