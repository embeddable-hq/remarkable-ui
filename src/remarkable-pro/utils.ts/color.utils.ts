import chroma from 'chroma-js';

export const isColorValid = (value: string) => chroma.valid(value);

export const setColorAlpha = (value: string, alpha: number) => {
  if (!chroma.valid(value)) return value;
  return chroma(value).alpha(alpha).css(); // returns rgba string
};
