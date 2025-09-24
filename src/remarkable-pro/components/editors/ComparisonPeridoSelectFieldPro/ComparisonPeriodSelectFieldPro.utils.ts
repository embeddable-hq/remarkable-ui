import { SelectListOptionProps } from '../../../../remarkable-ui';
import { TimeRange } from '@embeddable.com/core';
import { DateComparisonSelectFieldProOption } from './ComparisonPeriodSelectFieldPro.types';
import { getTimeRangeLabel } from '../editors.timeRange.utils';

export const getDateComparisonSelectFieldProOptions = (
  dateComparisonSelectFieldProOptions: DateComparisonSelectFieldProOption[],
  toCompareTimeRange: TimeRange,
): SelectListOptionProps[] => {
  return dateComparisonSelectFieldProOptions.map((option) => {
    return {
      rightLabel: toCompareTimeRange
        ? getTimeRangeLabel(option.getRange(toCompareTimeRange), option.dateFormat)
        : '',
      value: option.value,
      label: option.label,
    };
  });
};
