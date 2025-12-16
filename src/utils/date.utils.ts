import { DateRange } from 'react-day-picker';

export const isSameDate = (a?: Date, b?: Date) => a?.getTime() === b?.getTime();

export const isSameDateRange = (a?: DateRange, b?: DateRange) =>
  isSameDate(a?.from, b?.from) && isSameDate(a?.to, b?.to);

export const endOfDayUTC = (date: Date) => {
  const d = new Date(date);
  d.setUTCHours(23, 59, 59, 999);
  return d;
};
