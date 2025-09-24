import { SelectListOptionProps } from '../../../../remarkable-ui';
import { TimeRange } from '@embeddable.com/core';
import { DateComparisonSelectFieldProOption } from './ComparisonPeriodSelectFieldPro.types';
import { getTimeRangeLabel } from '../editors.timeRange.utils';

export const getDateComparisonSelectFieldProOptions = (
  dateComparisonSelectFieldProOptions: DateComparisonSelectFieldProOption[],
  toCompareDateRange: TimeRange,
): SelectListOptionProps[] => {
  return dateComparisonSelectFieldProOptions.map((option) => {
    return {
      rightLabel: toCompareDateRange
        ? getTimeRangeLabel(option.getRange(toCompareDateRange), option.dateFormat)
        : '',
      value: option.value,
      label: option.label,
    };
  });
};
