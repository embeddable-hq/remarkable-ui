const ISO_DATE_TIME_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}$/;

export const isValidISODate = (value: string): boolean => {
  return Boolean(value && ISO_DATE_TIME_REGEX.test(value));
};
