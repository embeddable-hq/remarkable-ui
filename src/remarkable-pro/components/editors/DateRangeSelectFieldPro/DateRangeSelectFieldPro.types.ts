import { TimeRangeDeserializedValue } from '@embeddable.com/core';

export type DateTimeSelectFieldProOption = {
  label: string;
  value: string;
  dateFormat: string;
  getRange: () => Omit<TimeRangeDeserializedValue, 'relativeTimeString'>;
};
