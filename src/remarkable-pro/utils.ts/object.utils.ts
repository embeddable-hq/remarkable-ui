export const getObjectStableKey = (obj: unknown): string => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stableStringify = (o: any): string => {
    if (o && typeof o === 'object' && !Array.isArray(o)) {
      return (
        '{' +
        Object.keys(o)
          .sort()
          .map((k) => `"${k}":${stableStringify(o[k])}`)
          .join(',') +
        '}'
      );
    } else if (Array.isArray(o)) {
      return '[' + o.map(stableStringify).join(',') + ']';
    }
    return JSON.stringify(o);
  };

  const json = stableStringify(obj);

  // FNV-1a 32-bit hash
  let hash = 0x811c9dc5;
  for (let i = 0; i < json.length; i++) {
    hash ^= json.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }

  return (hash >>> 0).toString(16);
};
