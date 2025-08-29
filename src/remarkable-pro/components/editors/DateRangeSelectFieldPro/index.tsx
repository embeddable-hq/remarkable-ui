import { useTheme } from '@embeddable.com/react';
import { SingleSelectField } from '../../../../remarkable-ui';
import { Theme } from '../../../theme/theme.types';
import { useLoadDayjsLocale } from '../../../utils.ts/date.utils';
import {
  compareDateTimeFieldOptionWithTimeRange,
  getDateTimeSelectFieldProOptions,
} from './DateRangeSelectFieldPro.utils';
import { TimeRange } from '@embeddable.com/core';
import { resolveI18nProps } from '../../component.utils';
import { EditorCard } from '../shared/EditorCard/EditorCard';
import { IconCalendarFilled } from '@tabler/icons-react';

type DateRangeSelectFieldProProps = {
  description?: string;
  onChange: (selectedTimeRange: TimeRange) => void;
  placeholder?: string;
  selectedValue: TimeRange;
  title?: string;
};

const DateRangeSelectFieldPro = (props: DateRangeSelectFieldProProps) => {
  const theme: Theme = useTheme() as Theme;
  const { dayjsLocaleReady } = useLoadDayjsLocale();

  if (!dayjsLocaleReady) {
    return null;
  }

  const { onChange, selectedValue, description, placeholder, title } = resolveI18nProps(props);

  const dateRangeOptions = theme.editors.dateRangeSelectFieldProOptions.options;

  const options = getDateTimeSelectFieldProOptions(dateRangeOptions);

  const handleChange = (value: string) => {
    if (!value) {
      return onChange(undefined);
    }

    const selectedOption = dateRangeOptions.find((option) => option.value === value);

    if (!selectedOption) return;

    onChange(selectedOption.getRange() as TimeRange);
  };

  const value =
    dateRangeOptions.find((dto) => compareDateTimeFieldOptionWithTimeRange(dto, selectedValue))
      ?.value ?? '';

  return (
    <EditorCard title={title} subtitle={description}>
      <SingleSelectField
        autoWidth
        startIcon={IconCalendarFilled}
        isClearable
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        options={options}
      />
    </EditorCard>
  );
};

export default DateRangeSelectFieldPro;
