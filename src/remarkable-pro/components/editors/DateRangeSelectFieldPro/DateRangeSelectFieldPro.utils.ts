import dayjs from 'dayjs';
import { DateRangeSelectFieldProOption } from './DateRangeSelectFieldPro.types';
import { SelectListOptionProps } from '../../../../remarkable-ui';
import { TimeRange } from '@embeddable.com/core';

export const getDateRangeSelectFieldProRangeLabel = (
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

export const getDateRangeSelectFieldProOptions = (
  dateRangeSelectFieldProOptions: DateRangeSelectFieldProOption[],
): SelectListOptionProps[] => {
  return dateRangeSelectFieldProOptions.map((option) => {
    return {
      rightLabel: getDateRangeSelectFieldProRangeLabel(option.getRange(), option.dateFormat),
      value: option.value,
      label: option.label,
    };
  });
};
