import dayjs from 'dayjs';
import { DateTimeSelectFieldProOption } from './DateTimeSelectFieldPro.types';
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
  dateTimeSelectFieldOptions: DateTimeSelectFieldProOption[],
): SelectListOptionProps[] => {
  return dateTimeSelectFieldOptions.map((option) => {
    return {
      rightLabel: getDateTimeSelectFieldProRangeLabel(option.getRange(), option.dateFormat),
      value: option.value,
      label: option.label,
    };
  });
};

export const compareDateTimeFieldOptionWithTimeRange = (
  dateTimeFieldOption: DateTimeSelectFieldProOption,
  timeRange: TimeRange,
) => {
  if (timeRange?.relativeTimeString) {
    console.log('comparing', timeRange.relativeTimeString, dateTimeFieldOption.value);

    return (
      timeRange.relativeTimeString.toLocaleLowerCase() ===
      dateTimeFieldOption.value.toLocaleLowerCase()
    );
  }

  const range = dateTimeFieldOption?.getRange?.();

  return (
    range?.from?.getTime() ===
      (timeRange?.from ? utcToLocalDate(timeRange?.from)?.getTime() : undefined) &&
    range?.to?.getTime() === (timeRange?.to ? utcToLocalDate(timeRange?.to)?.getTime() : undefined)
  );
};
