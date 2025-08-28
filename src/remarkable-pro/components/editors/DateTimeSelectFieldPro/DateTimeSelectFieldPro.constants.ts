import {
  DateTimeSelectFieldOption,
  DateTimeSelectFieldOptionGetRangeReturn,
} from './DateTimeSelectFieldPro.types';

const getWeekBounds = (date: Date, offset = 0): DateTimeSelectFieldOptionGetRangeReturn => {
  const d = new Date(date);
  const day = (d.getDay() + 6) % 7; // Mon=0…Sun=6
  d.setDate(d.getDate() - day + offset * 7);
  const from = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const to = new Date(from);
  to.setDate(from.getDate() + 6);
  to.setHours(23, 59, 59, 999);
  return {
    from,
    to,
  };
};

const getQuarterBounds = (date: Date, offset = 0): DateTimeSelectFieldOptionGetRangeReturn => {
  const currentQuarter = Math.floor(date.getMonth() / 3);
  const targetQuarter = currentQuarter + offset;
  const yearShift = Math.floor(targetQuarter / 4);
  const quarterIndex = ((targetQuarter % 4) + 4) % 4;
  const year = date.getFullYear() + yearShift;
  const start = new Date(year, quarterIndex * 3, 1);
  const end = new Date(year, quarterIndex * 3 + 3, 0, 23, 59, 59, 999);
  return {
    from: start,
    to: end,
  };
};

export const dateTimeSelectFieldDefaultOptions: DateTimeSelectFieldOption[] = [
  {
    value: 'today',
    label: 'Today',
    getRange: () => {
      const now = new Date();
      const from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const to = new Date(from);
      to.setHours(23, 59, 59, 999);
      return {
        from,
        to,
      };
    },
    dateFormat: 'MMM DD',
  },
  {
    value: 'yesterday',
    label: 'Yesterday',
    getRange: () => {
      const now = new Date();
      const from = new Date(now);
      from.setDate(now.getDate() - 1);
      from.setHours(0, 0, 0, 0);
      const to = new Date(from);
      to.setHours(23, 59, 59, 999);
      return {
        from,
        to,
      };
    },
    dateFormat: 'MMM DD',
  },
  {
    value: 'thisWeek',
    label: 'This week',
    getRange: () => getWeekBounds(new Date(), 0),
    dateFormat: 'MMM DD',
  },
  {
    value: 'lastWeek',
    label: 'Last week',
    getRange: () => getWeekBounds(new Date(), -1),
    dateFormat: 'MMM DD',
  },
  {
    value: 'weekToDate',
    label: 'Week to date',
    getRange: () => {
      const now = new Date();
      const { from } = getWeekBounds(now, 0)!;
      const to = now;
      return {
        from,
        to,
      };
    },
    dateFormat: 'MMM DD',
  },
  {
    value: 'last7Days',
    label: 'Last 7 days',
    getRange: () => {
      const to = new Date();
      to.setHours(23, 59, 59, 999);
      const from = new Date(to);
      from.setDate(to.getDate() - 6);
      from.setHours(0, 0, 0, 0);
      return {
        from,
        to,
      };
    },
    dateFormat: 'MMM DD',
  },
  {
    value: 'next7Days',
    label: 'Next 7 days',
    getRange: () => {
      const from = new Date();
      from.setHours(0, 0, 0, 0);
      const to = new Date(from);
      to.setDate(from.getDate() + 6);
      to.setHours(23, 59, 59, 999);
      return {
        from,
        to,
      };
    },
    dateFormat: 'MMM DD',
  },
  {
    value: 'last30Days',
    label: 'Last 30 days',
    getRange: () => {
      const to = new Date();
      to.setHours(23, 59, 59, 999);
      const from = new Date(to);
      from.setDate(to.getDate() - 29);
      from.setHours(0, 0, 0, 0);
      return {
        from,
        to,
      };
    },
    dateFormat: 'MMM DD',
  },
  {
    value: 'next30Days',
    label: 'Next 30 days',
    getRange: () => {
      const from = new Date();
      from.setHours(0, 0, 0, 0);
      const to = new Date(from);
      to.setDate(from.getDate() + 29);
      to.setHours(23, 59, 59, 999);
      return {
        from,
        to,
      };
    },
    dateFormat: 'MMM DD',
  },
  {
    value: 'thisMonth',
    label: 'This month',
    getRange: () => {
      const now = new Date();
      const from = new Date(now.getFullYear(), now.getMonth(), 1);
      const to = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      return {
        from,
        to,
      };
    },
    dateFormat: 'MMM YY',
  },
  {
    value: 'lastMonth',
    label: 'Last month',
    getRange: () => {
      const now = new Date();
      const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const to = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      return {
        from,
        to,
      };
    },
    dateFormat: 'MMM YY',
  },
  {
    value: 'nextMonth',
    label: 'Next month',
    getRange: () => {
      const now = new Date();
      const from = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const to = new Date(now.getFullYear(), now.getMonth() + 2, 0, 23, 59, 59, 999);
      return { from, to };
    },
    dateFormat: 'MMM YY',
  },
  {
    value: 'thisQuarter',
    label: 'This quarter',
    getRange: () => getQuarterBounds(new Date(), 0),
    dateFormat: 'MMM YY',
  },
  {
    value: 'lastQuarter',
    label: 'Last quarter',
    getRange: () => getQuarterBounds(new Date(), -1),
    dateFormat: 'MMM YY',
  },
  {
    value: 'nextQuarter',
    label: 'Next quarter',
    getRange: () => getQuarterBounds(new Date(), +1),
    dateFormat: 'MMM YY',
  },
  {
    value: 'quarterToDate',
    label: 'Quarter to date',
    getRange: () => {
      const now = new Date();
      const { from } = getQuarterBounds(now, 0)!;
      const to = now;
      return { from, to };
    },
    dateFormat: 'MMM YY',
  },
  {
    value: 'last6Months',
    label: 'Last 6 months',
    getRange: () => {
      const to = new Date();
      to.setHours(23, 59, 59, 999);
      const from = new Date(to);
      from.setMonth(to.getMonth() - 6);
      from.setHours(0, 0, 0, 0);
      return { from, to };
    },
    dateFormat: 'MMM YY',
  },
  {
    value: 'last12Months',
    label: 'Last 12 months',
    getRange: () => {
      const to = new Date();
      to.setHours(23, 59, 59, 999);
      const from = new Date(to);
      from.setMonth(to.getMonth() - 12);
      from.setHours(0, 0, 0, 0);
      return { from, to };
    },
    dateFormat: 'MMM YY',
  },
  {
    value: 'thisYear',
    label: 'This year',
    getRange: () => {
      const now = new Date();
      const from = new Date(now.getFullYear(), 0, 1);
      const to = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      return { from, to };
    },
    dateFormat: 'YYYY',
  },
  {
    value: 'lastYear',
    label: 'Last year',
    getRange: () => {
      const now = new Date();
      const year = now.getFullYear() - 1;
      const from = new Date(year, 0, 1);
      const to = new Date(year, 11, 31, 23, 59, 59, 999);
      return { from, to };
    },
    dateFormat: 'YYYY',
  },
  {
    value: 'nextYear',
    label: 'Next year',
    getRange: () => {
      const now = new Date();
      const year = now.getFullYear() + 1;
      const from = new Date(year, 0, 1);
      const to = new Date(year, 11, 31, 23, 59, 59, 999);
      return { from, to };
    },
    dateFormat: 'YYYY',
  },
  {
    value: 'yearToDate',
    label: 'Year to date',
    getRange: () => {
      const now = new Date();
      const from = new Date(now.getFullYear(), 0, 1);
      const to = now;
      return { from, to };
    },
    dateFormat: 'MMM YY',
  },
  {
    value: 'allTime',
    label: 'All time',
  },
];
