import React from 'react';
import { DateRange, DayPicker } from 'react-day-picker';
import './DateRangePicker.css';
import { DateRangePickerChevron } from './DateRangePickerChevron';
import { endOfDayUTC } from '../../../../utils/date.utils';
import * as rdpLocales from 'react-day-picker/locale';

type DateRangePickerProps = {
  numberOfMonths?: number;
  locale?: string;
  dateRange?: DateRange;
  onChange: (dateRange: DateRange | undefined) => void;
};

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  dateRange,
  numberOfMonths = 1,
  locale = 'en',
  onChange,
}) => {
  const handleChange = (range: DateRange | undefined) => {
    if (range?.to) {
      range.to = endOfDayUTC(range.to);
    }
    onChange(range);
  };

  return (
    <DayPicker
      numberOfMonths={numberOfMonths}
      components={{ Chevron: DateRangePickerChevron }}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      locale={(rdpLocales as Record<string, any>)[locale]}
      mode="range"
      navLayout="around"
      onSelect={handleChange}
      selected={dateRange}
      timeZone="UTC"
      showOutsideDays
    />
  );
};
