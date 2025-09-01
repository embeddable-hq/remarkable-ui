import dayjs from 'dayjs';
import { DateTimeSelectFieldProOption } from './DateRangeSelectFieldPro.types';
import { SelectListOptionProps } from '../../../../remarkable-ui';
import { TimeRange, TimeRangeDeserializedValue } from '@embeddable.com/core';
import { utcToLocalDate } from '../../../utils.ts/date.utils';

export const getDateTimeSelectFieldProRangeLabel = (
  range: Omit<TimeRangeDeserializedValue, 'relativeTimeString'>,
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

export const getDateTimeSelectFieldProOptions = (
  dateRangeSelectFieldProOptions: DateTimeSelectFieldProOption[],
): SelectListOptionProps[] => {
  return dateRangeSelectFieldProOptions.map((option) => {
    return {
      rightLabel: getDateTimeSelectFieldProRangeLabel(option.getRange(), option.dateFormat),
      value: option.value,
      label: option.label,
    };
  });
};

export const compareDateRangeFieldProOptionWithTimeRange = (
  dateRangeSelectFieldProOption: DateTimeSelectFieldProOption,
  timeRange: TimeRange,
) => {
  if (timeRange?.relativeTimeString) {
    return (
      timeRange.relativeTimeString.toLocaleLowerCase() ===
      dateRangeSelectFieldProOption.value.toLocaleLowerCase()
    );
  }

  const range = dateRangeSelectFieldProOption?.getRange?.();

  return (
    range?.from?.getTime() ===
      (timeRange?.from ? utcToLocalDate(timeRange?.from)?.getTime() : undefined) &&
    range?.to?.getTime() === (timeRange?.to ? utcToLocalDate(timeRange?.to)?.getTime() : undefined)
  );
};
