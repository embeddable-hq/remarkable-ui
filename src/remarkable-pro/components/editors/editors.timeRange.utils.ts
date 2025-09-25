import { TimeRange } from '@embeddable.com/core';
import { Theme } from '../../theme/theme.types';
import dayjs from 'dayjs';

export const getTimeRangeFromTo = (receivedTimeRange: TimeRange, theme: Theme): TimeRange => {
  return receivedTimeRange?.relativeTimeString
    ? (theme.editors.dateRangeSelectFieldPro.options
        .find((dateRange) => dateRange.value === receivedTimeRange?.relativeTimeString)
        ?.getRange() as TimeRange)
    : receivedTimeRange;
};

export const getTimeRangeLabel = (range: TimeRange, dateFormat: string): string => {
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
