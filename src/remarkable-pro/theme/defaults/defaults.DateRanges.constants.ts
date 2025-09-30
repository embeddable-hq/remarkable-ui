import { TimeRange } from '@embeddable.com/core';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import isoWeek from 'dayjs/plugin/isoWeek.js';
import quarterOfYear from 'dayjs/plugin/quarterOfYear.js';

dayjs.extend(utc);
dayjs.extend(isoWeek);
dayjs.extend(quarterOfYear);

const getWeekBounds = (date: Date, offset = 0): TimeRange => {
  const d = dayjs.utc(date).add(offset, 'week');
  const from = d.startOf('isoWeek').toDate(); // Monday
  const to = d.endOf('isoWeek').toDate(); // Sunday

  return {
    from,
    to,
    relativeTimeString: '',
  };
};

const getQuarterBounds = (date: Date, offset = 0): TimeRange => {
  const d = dayjs.utc(date).add(offset, 'quarter');
  const from = d.startOf('quarter').toDate();
  const to = d.endOf('quarter').toDate();

  return {
    from,
    to,
    relativeTimeString: '',
  };
};

export type DateRangeOption = {
  label: string;
  value: string;
  dateFormat: string;
  getRange: () => TimeRange;
};

export const defaultDateRangeOptions: DateRangeOption[] = [
  {
    value: 'Today',
    label: 'Today',
    getRange: () => {
      const now = dayjs.utc(new Date());
      const from = now.startOf('day').toDate();
      const to = now.endOf('day').toDate();

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
      const now = dayjs.utc(new Date());
      const from = now.subtract(1, 'day').startOf('day').toDate();
      const to = now.subtract(1, 'day').endOf('day').toDate();

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
      const now = dayjs.utc(new Date());
      const from = now.startOf('isoWeek').toDate(); // Monday as start of week
      const to = now.endOf('day').toDate();

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
      const now = dayjs.utc(new Date());
      const to = now.endOf('day').toDate();
      const from = now.subtract(6, 'day').startOf('day').toDate();

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
      const now = dayjs.utc(new Date());
      const from = now.startOf('day').toDate();
      const to = now.add(6, 'day').endOf('day').toDate();

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
      const now = dayjs.utc(new Date());
      const to = now.endOf('day').toDate();
      const from = now.subtract(29, 'day').startOf('day').toDate();

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
      const now = dayjs.utc(new Date());
      const from = now.startOf('day').toDate();
      const to = now.add(29, 'day').endOf('day').toDate();

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
      const now = dayjs.utc(new Date());
      const from = now.startOf('month').toDate();
      const to = now.endOf('month').toDate();

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
      const now = dayjs.utc(new Date());
      const from = now.subtract(1, 'month').startOf('month').toDate();
      const to = now.subtract(1, 'month').endOf('month').toDate();

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
      const now = dayjs.utc(new Date());
      const from = now.add(1, 'month').startOf('month').toDate();
      const to = now.add(1, 'month').endOf('month').toDate();

      return {
        from,
        to,
        relativeTimeString: '',
      };
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
      const now = dayjs.utc(new Date());
      const from = now.startOf('quarter').toDate(); // start of current quarter
      const to = now.endOf('day').toDate(); // today at 23:59:59.999

      return {
        from,
        to,
        relativeTimeString: '',
      };
    },
    dateFormat: 'MMM YYYY',
  },
  {
    value: 'Last 6 months',
    label: 'Last 6 months',
    getRange: () => {
      const now = dayjs.utc(new Date());
      const to = now.endOf('day').toDate();
      const from = now.subtract(6, 'month').startOf('day').toDate();

      return {
        from,
        to,
        relativeTimeString: '',
      };
    },
    dateFormat: 'MMM YYYY',
  },
  {
    value: 'Last 12 months',
    label: 'Last 12 months',
    getRange: () => {
      const now = dayjs.utc(new Date());
      const to = now.endOf('day').toDate();
      const from = now.subtract(12, 'month').startOf('day').toDate();

      return {
        from,
        to,
        relativeTimeString: '',
      };
    },
    dateFormat: 'MMM YYYY',
  },
  {
    value: 'This year',
    label: 'This year',
    getRange: () => {
      const now = dayjs.utc(new Date());
      const from = now.startOf('year').toDate();
      const to = now.endOf('year').toDate();

      return {
        from,
        to,
        relativeTimeString: '',
      };
    },
    dateFormat: 'YYYY',
  },
  {
    value: 'Last year',
    label: 'Last year',
    getRange: () => {
      const now = dayjs.utc(new Date());
      const from = now.subtract(1, 'year').startOf('year').toDate();
      const to = now.subtract(1, 'year').endOf('year').toDate();

      return {
        from,
        to,
        relativeTimeString: '',
      };
    },
    dateFormat: 'YYYY',
  },
  {
    value: 'Next year',
    label: 'Next year',
    getRange: () => {
      const now = dayjs.utc(new Date());
      const from = now.add(1, 'year').startOf('year').toDate();
      const to = now.add(1, 'year').endOf('year').toDate();

      return {
        from,
        to,
        relativeTimeString: '',
      };
    },
    dateFormat: 'YYYY',
  },
  {
    value: 'Year to date',
    label: 'Year to date',
    getRange: () => {
      const now = dayjs.utc(new Date());
      const from = now.startOf('year').toDate();
      const to = now.endOf('day').toDate();

      return {
        from,
        to,
        relativeTimeString: '',
      };
    },
    dateFormat: 'MMM YYYY',
  },
];
