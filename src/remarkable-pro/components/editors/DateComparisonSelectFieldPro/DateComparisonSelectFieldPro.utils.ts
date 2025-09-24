import dayjs from 'dayjs';
import { SelectListOptionProps } from '../../../../remarkable-ui';
import { TimeRange } from '@embeddable.com/core';
import { DateComparisonSelectFieldProOption } from './DateComparisonSelectFieldPro.types';

// TODO: make DRY with DateRangeSelectFieldPro.utils.ts or other
export const getDateTimeSelectFieldProRangeLabel = (
  range: TimeRange,
  dateFormat: string,
): string => {
  if (!range) {
    return '';
  }

  const { from, to } = range;

  if (!from || !to) {
    return '';
  }

  const labelFrom = dayjs(from).format(dateFormat);
  const labelTo = dayjs(to).format(dateFormat);

  if (labelFrom === labelTo) {
    return labelFrom;
  }

  return `${labelFrom} - ${labelTo}`;
};

export const getDateComparisonSelectFieldProOptions = (
  dateComparisonSelectFieldProOptions: DateComparisonSelectFieldProOption[],
  toCompareDateRange: TimeRange,
): SelectListOptionProps[] => {
  return dateComparisonSelectFieldProOptions.map((option) => {
    return {
      rightLabel: toCompareDateRange
        ? getDateTimeSelectFieldProRangeLabel(
            option.getRange(toCompareDateRange),
            option.dateFormat,
          )
        : '',
      value: option.value,
      label: option.label,
    };
  });
};
