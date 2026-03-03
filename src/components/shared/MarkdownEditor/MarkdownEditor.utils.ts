export const MAX_HISTORY = 100;

export const applyWrap = (value: string, start: number, end: number, syntax: string): string =>
  value.slice(0, start) + syntax + value.slice(start, end) + syntax + value.slice(end);

export const applyLinePrefix = (value: string, start: number, prefix: string): string => {
  const lineStart = value.lastIndexOf('\n', start - 1) + 1;
  return value.slice(0, lineStart) + prefix + value.slice(lineStart);
};
