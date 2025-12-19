import React, { useState } from 'react';
import { DateRange, DayPicker } from 'react-day-picker';
import './DateRangePicker.css';
import { DateRangePickerChevron } from './DateRangePickerChevron';
import { endOfDayUTC } from '../../../../utils/date.utils';
import * as rdpLocales from 'react-day-picker/locale';

export type DateRangePickerProps = {
  numberOfMonths?: number;
  locale?: string;
  value?: DateRange;
  onChange: (dateRange: DateRange | undefined) => void;
};

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  numberOfMonths = 1,
  locale = 'en',
  onChange,
}) => {
  const [month, setMonth] = useState<Date>(value?.from ?? new Date());

  const handleChange = (range: DateRange | undefined) => {
    if (range?.to) {
      range.to = endOfDayUTC(range.to);
    }
    onChange(range);
  };

  const now = new Date();
  const endMonth = new Date(now.getFullYear() + 2, now.getMonth());

  return (
    <DayPicker
      month={month}
      onMonthChange={setMonth}
      numberOfMonths={numberOfMonths}
      components={{ Chevron: DateRangePickerChevron }}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      locale={(rdpLocales as Record<string, any>)[locale]}
      mode="range"
      navLayout="around"
      onSelect={handleChange}
      selected={value}
      timeZone="UTC"
      showOutsideDays
      captionLayout="dropdown-years"
      endMonth={endMonth}
      animate
    />
  );
};
