import { TimeRange, TimeRangeDeserializedValue } from '@embeddable.com/core';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek.js';
import quarterOfYear from 'dayjs/plugin/quarterOfYear.js';

dayjs.extend(isoWeek);
dayjs.extend(quarterOfYear);

const getPreviousPeriodRange = (primaryDateRange: TimeRange) => {
  const { from: primaryFrom, to: primaryTo } = primaryDateRange as TimeRangeDeserializedValue;
  if (!primaryFrom || !primaryTo) return undefined;

  const dateFrom = dayjs(primaryFrom);

  // inclusive difference
  const gapDays = dayjs(primaryTo).diff(dateFrom, 'day') + 1;

  const prevTo = dateFrom.subtract(1, 'day'); // the day before current range starts
  const prevFrom = prevTo.subtract(gapDays - 1, 'day'); // full length backwards

  return {
    from: prevFrom.startOf('day').toDate(),
    to: prevTo.endOf('day').toDate(),
    relativeTimeString: '',
  };
};

const getPreviousWeekRange = (primaryDateRange: TimeRange) => {
  const { from: primaryFrom } = primaryDateRange as TimeRangeDeserializedValue;
  if (!primaryFrom) return undefined;

  const dateFrom = dayjs(primaryFrom);

  // find the start of *this* week, then go one week back
  const prevWeekStart = dateFrom.startOf('isoWeek').subtract(1, 'week');
  const prevWeekEnd = prevWeekStart.endOf('isoWeek');

  return {
    from: prevWeekStart.startOf('day').toDate(),
    to: prevWeekEnd.endOf('day').toDate(),
    relativeTimeString: '',
  };
};

const getPreviousMonthRange = (primaryDateRange: TimeRange) => {
  const { from: primaryFrom } = primaryDateRange as TimeRangeDeserializedValue;
  if (!primaryFrom) return undefined;

  const dateFrom = dayjs(primaryFrom);

  // find the start of this month, then go one month back
  const prevMonthStart = dateFrom.startOf('month').subtract(1, 'month');
  const prevMonthEnd = prevMonthStart.endOf('month');

  return {
    from: prevMonthStart.startOf('day').toDate(),
    to: prevMonthEnd.endOf('day').toDate(),
    relativeTimeString: '',
  };
};

const getPreviousQuarterRange = (primaryDateRange: TimeRange) => {
  const { from: primaryFrom } = primaryDateRange as TimeRangeDeserializedValue;
  if (!primaryFrom) return undefined;

  const dateFrom = dayjs(primaryFrom);

  // find the start of this quarter, then go one quarter back
  const prevQuarterStart = dateFrom.startOf('quarter').subtract(1, 'quarter');
  const prevQuarterEnd = prevQuarterStart.endOf('quarter');

  return {
    from: prevQuarterStart.startOf('day').toDate(),
    to: prevQuarterEnd.endOf('day').toDate(),
    relativeTimeString: '',
  };
};

const getPreviousYearRange = (primaryDateRange: TimeRange) => {
  const { from: primaryFrom } = primaryDateRange as TimeRangeDeserializedValue;
  if (!primaryFrom) return undefined;

  const dateFrom = dayjs(primaryFrom);

  // find the start of this year, then go one year back
  const prevYearStart = dateFrom.startOf('year').subtract(1, 'year');
  const prevYearEnd = prevYearStart.endOf('year');

  return {
    from: prevYearStart.startOf('day').toDate(),
    to: prevYearEnd.endOf('day').toDate(),
    relativeTimeString: '',
  };
};

export type ComparisonPeriodOption = {
  label: string;
  value: string;
  dateFormat: string;
  getRange: (dateRange: TimeRange) => TimeRange;
};

export const defaultComparisonPeriodOptions: ComparisonPeriodOption[] = [
  {
    value: 'Previous period',
    label: 'defaults.comparisonPeriodOptions.previousPeriod|Previous period',
    getRange: getPreviousPeriodRange,
    dateFormat: 'DD MMM YYYY',
  },
  {
    value: 'Previous week',
    label: 'defaults.comparisonPeriodOptions.previousWeek|Previous week',
    getRange: getPreviousWeekRange,
    dateFormat: 'MMM DD',
  },
  {
    value: 'Previous month',
    label: 'defaults.comparisonPeriodOptions.previousMonth|Previous month',
    getRange: getPreviousMonthRange,
    dateFormat: 'MMM YYYY',
  },
  {
    value: 'Previous quarter',
    label: 'defaults.comparisonPeriodOptions.previousQuarter|Previous quarter',
    getRange: getPreviousQuarterRange,
    dateFormat: 'MMM YYYY',
  },
  {
    value: 'Previous year',
    label: 'defaults.comparisonPeriodOptions.previousYear|Previous year',
    getRange: getPreviousYearRange,
    dateFormat: 'YYYY',
  },
];
