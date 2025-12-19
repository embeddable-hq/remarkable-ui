// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const shallowEqual = (object1: any, object2: any): boolean => {
  const keys1 = Object.keys(object1 ?? {});
  const keys2 = Object.keys(object2 ?? {});

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (object1[key]?.toString() !== object2[key]?.toString()) {
      return false;
    }
  }

  return true;
};
