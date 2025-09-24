import { TimeRange } from '@embeddable.com/core';

export type DateComparisonSelectFieldProOption = {
  label: string;
  value: string;
  dateFormat: string;
  getRange: (dateRange: TimeRange) => TimeRange;
};
