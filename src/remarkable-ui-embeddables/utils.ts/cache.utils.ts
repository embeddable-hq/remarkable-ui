/**
 * Creates a formatter cache.
 * Cache used to prevent unnecessary (expensive) creation of formatter objects
 */
export const cache = <Params, Formatter>(factory: (params?: Params) => Formatter) => {
  const internalCache: { [key: string]: Formatter } = {};
  const get = (params?: Params) => {
    const key = JSON.stringify(params);
    let formatter = internalCache[key];
    if (formatter) {
      return formatter;
    }
    formatter = factory(params);
    internalCache[key] = formatter;
    return formatter;
  };
  return get;
};
