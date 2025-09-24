import { TimeRange } from '@embeddable.com/core';
import { DateRangeSelectFieldProOption } from './DateRangeSelectFieldPro.types';

const getWeekBounds = (date: Date, offset = 0): TimeRange => {
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
    relativeTimeString: '',
  };
};

const getQuarterBounds = (date: Date, offset = 0): TimeRange => {
  const currentQuarter = Math.floor(date.getMonth() / 3);
  const targetQuarter = currentQuarter + offset;
  const yearShift = Math.floor(targetQuarter / 4);
  const quarterIndex = ((targetQuarter % 4) + 4) % 4;
  const year = date.getFullYear() + yearShift;
  const from = new Date(year, quarterIndex * 3, 1);
  const to = new Date(year, quarterIndex * 3 + 3, 0, 23, 59, 59, 999);
  return {
    from,
    to,
    relativeTimeString: '',
  };
};

export const defaultDateTimeSelectFieldProOptions: DateRangeSelectFieldProOption[] = [
  {
    value: 'Today',
    label: 'Today',
    getRange: () => {
      const now = new Date();
      const from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const to = new Date(from);
      to.setHours(23, 59, 59, 999);
      return {
        from,
        to,
        relativeTimeString: '',
      };
    },
    dateFormat: 'MMM DD',
  },
  {
    value: 'Yesterday',
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
        relativeTimeString: '',
      };
    },
    dateFormat: 'MMM DD',
  },
  {
    value: 'This week',
    label: 'This week',
    getRange: () => getWeekBounds(new Date(), 0),
    dateFormat: 'MMM DD',
  },
  {
    value: 'Last week',
    label: 'Last week',
    getRange: () => getWeekBounds(new Date(), -1),
    dateFormat: 'MMM DD',
  },
  {
    value: 'Week to date',
    label: 'Week to date',
    getRange: () => {
      const now = new Date();
      const { from } = getWeekBounds(now, 0)!;
      const to = new Date(now);
      to.setHours(23, 59, 59, 999);

      return {
        from,
        to,
        relativeTimeString: '',
      };
    },
    dateFormat: 'MMM DD',
  },
  {
    value: 'Last 7 days',
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
        relativeTimeString: '',
      };
    },
    dateFormat: 'MMM DD',
  },
  {
    value: 'Next 7 days',
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
        relativeTimeString: '',
      };
    },
    dateFormat: 'MMM DD',
  },
  {
    value: 'Last 30 days',
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
        relativeTimeString: '',
      };
    },
    dateFormat: 'MMM DD',
  },
  {
    value: 'Next 30 days',
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
        relativeTimeString: '',
      };
    },
    dateFormat: 'MMM DD',
  },
  {
    value: 'This month',
    label: 'This month',
    getRange: () => {
      const now = new Date();
      const from = new Date(now.getFullYear(), now.getMonth(), 1);
      const to = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      return {
        from,
        to,
        relativeTimeString: '',
      };
    },
    dateFormat: 'MMM YYYY',
  },
  {
    value: 'Last month',
    label: 'Last month',
    getRange: () => {
      const now = new Date();
      const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      const to = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
      return {
        from,
        to,
        relativeTimeString: '',
      };
    },
    dateFormat: 'MMM YYYY',
  },
  {
    value: 'Next month',
    label: 'Next month',
    getRange: () => {
      const now = new Date();
      const from = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      const to = new Date(now.getFullYear(), now.getMonth() + 2, 0, 23, 59, 59, 999);
      return { from, to, relativeTimeString: '' };
    },
    dateFormat: 'MMM YYYY',
  },
  {
    value: 'This quarter',
    label: 'This quarter',
    getRange: () => getQuarterBounds(new Date(), 0),
    dateFormat: 'MMM YYYY',
  },
  {
    value: 'Last quarter',
    label: 'Last quarter',
    getRange: () => getQuarterBounds(new Date(), -1),
    dateFormat: 'MMM YYYY',
  },
  {
    value: 'Next quarter',
    label: 'Next quarter',
    getRange: () => getQuarterBounds(new Date(), +1),
    dateFormat: 'MMM YYYY',
  },
  {
    value: 'Quarter to date',
    label: 'Quarter to date',
    getRange: () => {
      const now = new Date();
      const { from } = getQuarterBounds(now, 0)!;
      const to = new Date(now);
      to.setHours(23, 59, 59, 999);
      return { from, to, relativeTimeString: '' };
    },
    dateFormat: 'MMM YYYY',
  },
  {
    value: 'Last 6 months',
    label: 'Last 6 months',
    getRange: () => {
      const to = new Date();
      to.setHours(23, 59, 59, 999);
      const from = new Date(to);
      from.setMonth(to.getMonth() - 6);
      from.setHours(0, 0, 0, 0);
      return { from, to, relativeTimeString: '' };
    },
    dateFormat: 'MMM YYYY',
  },
  {
    value: 'Last 12 months',
    label: 'Last 12 months',
    getRange: () => {
      const to = new Date();
      to.setHours(23, 59, 59, 999);
      const from = new Date(to);
      from.setMonth(to.getMonth() - 12);
      from.setHours(0, 0, 0, 0);
      return { from, to, relativeTimeString: '' };
    },
    dateFormat: 'MMM YYYY',
  },
  {
    value: 'This year',
    label: 'This year',
    getRange: () => {
      const now = new Date();
      const from = new Date(now.getFullYear(), 0, 1);
      const to = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
      return { from, to, relativeTimeString: '' };
    },
    dateFormat: 'YYYY',
  },
  {
    value: 'Last year',
    label: 'Last year',
    getRange: () => {
      const now = new Date();
      const year = now.getFullYear() - 1;
      const from = new Date(year, 0, 1);
      const to = new Date(year, 11, 31, 23, 59, 59, 999);
      return { from, to, relativeTimeString: '' };
    },
    dateFormat: 'YYYY',
  },
  {
    value: 'Next year',
    label: 'Next year',
    getRange: () => {
      const now = new Date();
      const year = now.getFullYear() + 1;
      const from = new Date(year, 0, 1);
      const to = new Date(year, 11, 31, 23, 59, 59, 999);
      return { from, to, relativeTimeString: '' };
    },
    dateFormat: 'YYYY',
  },
  {
    value: 'Year to date',
    label: 'Year to date',
    getRange: () => {
      const now = new Date();
      const from = new Date(now.getFullYear(), 0, 1);
      const to = new Date(now);
      to.setHours(23, 59, 59, 999);
      return { from, to, relativeTimeString: '' };
    },
    dateFormat: 'MMM YYYY',
  },
];
