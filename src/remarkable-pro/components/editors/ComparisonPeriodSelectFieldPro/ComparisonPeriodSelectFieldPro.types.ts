import { TimeRange } from '@embeddable.com/core';

export type ComparisonPeriodSelectFieldProOption = {
  label: string;
  value: string;
  dateFormat: string;
  getRange: (dateRange: TimeRange) => TimeRange;
};
