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
  value: string;
  label: string;
  dateFormat: string;
  getRange: () => TimeRange;
};

export const defaultDateRangeOptions: DateRangeOption[] = [
  {
    value: 'Today',
    label: 'defaults.dateRangeOptions.today|Today',
    dateFormat: 'MMM DD',
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
  },
  {
    value: 'Yesterday',
    label: 'defaults.dateRangeOptions.yesterday|Yesterday',
    dateFormat: 'MMM DD',
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
  },
  {
    value: 'This week',
    label: 'defaults.dateRangeOptions.thisWeek|This week',
    dateFormat: 'MMM DD',
    getRange: () => getWeekBounds(new Date(), 0),
  },
  {
    value: 'Last week',
    label: 'defaults.dateRangeOptions.lastWeek|Last week',
    dateFormat: 'MMM DD',
    getRange: () => getWeekBounds(new Date(), -1),
  },
  {
    value: 'Week to date',
    label: 'defaults.dateRangeOptions.weekToDate|Week to date',
    dateFormat: 'MMM DD',
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
  },
  {
    value: 'Last 7 days',
    label: 'defaults.dateRangeOptions.last7Days|Last 7 days',
    dateFormat: 'MMM DD',
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
  },
  {
    value: 'Next 7 days',
    label: 'defaults.dateRangeOptions.next7Days|Next 7 days',
    dateFormat: 'MMM DD',
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
  },
  {
    value: 'Last 30 days',
    label: 'defaults.dateRangeOptions.last30Days|Last 30 days',
    dateFormat: 'MMM DD',
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
  },
  {
    value: 'Next 30 days',
    label: 'defaults.dateRangeOptions.next30Days|Next 30 days',
    dateFormat: 'MMM DD',
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
  },
  {
    value: 'This month',
    label: 'defaults.dateRangeOptions.thisMonth|This month',
    dateFormat: 'MMM YYYY',
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
  },
  {
    value: 'Last month',
    label: 'defaults.dateRangeOptions.lastMonth|Last month',
    dateFormat: 'MMM YYYY',
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
  },
  {
    value: 'Next month',
    label: 'defaults.dateRangeOptions.nextMonth|Next month',
    dateFormat: 'MMM YYYY',
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
  },
  {
    value: 'This quarter',
    label: 'defaults.dateRangeOptions.thisQuarter|This quarter',
    dateFormat: 'MMM YYYY',
    getRange: () => getQuarterBounds(new Date(), 0),
  },
  {
    value: 'Last quarter',
    label: 'defaults.dateRangeOptions.lastQuarter|Last quarter',
    dateFormat: 'MMM YYYY',
    getRange: () => getQuarterBounds(new Date(), -1),
  },
  {
    value: 'Next quarter',
    label: 'defaults.dateRangeOptions.nextQuarter|Next quarter',
    dateFormat: 'MMM YYYY',
    getRange: () => getQuarterBounds(new Date(), +1),
  },
  {
    value: 'Quarter to date',
    label: 'defaults.dateRangeOptions.quarterToDate|Quarter to date',
    dateFormat: 'MMM YYYY',
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
  },
  {
    value: 'Last 6 months',
    label: 'defaults.dateRangeOptions.last6Months|Last 6 months',
    dateFormat: 'MMM YYYY',
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
  },
  {
    value: 'Last 12 months',
    label: 'defaults.dateRangeOptions.last12Months|Last 12 months',
    dateFormat: 'MMM YYYY',
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
  },
  {
    value: 'This year',
    label: 'defaults.dateRangeOptions.thisYear|This year',
    dateFormat: 'YYYY',
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
  },
  {
    value: 'Last year',
    label: 'defaults.dateRangeOptions.lastYear|Last year',
    dateFormat: 'YYYY',
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
  },
  {
    value: 'Next year',
    label: 'defaults.dateRangeOptions.nextYear|Next year',
    dateFormat: 'YYYY',
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
  },
  {
    value: 'Year to date',
    label: 'defaults.dateRangeOptions.yearToDate|Year to date',
    dateFormat: 'MMM YYYY',
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
  },
];
