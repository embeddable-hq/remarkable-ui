import { useTheme } from '@embeddable.com/react';
import { SingleSelectField } from '../../../../remarkable-ui';
import { Theme } from '../../../theme/theme.types';
import { useLoadDayjsLocale } from '../../../utils.ts/date.utils';
import {
  compareDateTimeFieldOptionWithTimeRange,
  getDateTimeSelectFieldProOptions,
} from './DateTimeSelectFieldPro.utils';
import { TimeRange } from '@embeddable.com/core';
import { resolveI18nProps } from '../../component.utils';
import { EditorCard } from '../shared/EditorCard/EditorCard';
import { dateTimeSelectFieldDefaultOptions } from './DateTimeSelectFieldPro.constants';

type DateTimeSelectFieldProProps = {
  description?: string;
  onChange: (selectedTimeRange: TimeRange) => void;
  placeholder?: string;
  selectedValue: TimeRange;
  title?: string;
};

const DateTimeSelectFieldPro = (props: DateTimeSelectFieldProProps) => {
  const theme: Theme = useTheme() as Theme;
  const { dayjsLocalReady } = useLoadDayjsLocale();

  if (!dayjsLocalReady) {
    return null;
  }

  const { onChange, selectedValue, description, placeholder, title } = resolveI18nProps(props);

  const dateTimeOptions =
    theme.editors?.dateTimeSelectFieldOverrides?.options ?? dateTimeSelectFieldDefaultOptions;

  const options = getDateTimeSelectFieldProOptions(dateTimeOptions);

  const handleChange = (value: string) => {
    if (!value) {
      return onChange(undefined);
    }

    const selectedOption = dateTimeOptions.find((option) => option.value === value);
    onChange(selectedOption.getRange());
  };

  const value =
    dateTimeOptions.find((dto) => compareDateTimeFieldOptionWithTimeRange(dto, selectedValue))
      ?.value ?? '';

  return (
    <EditorCard title={title} subtitle={description}>
      <SingleSelectField
        isClearable
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        options={options}
      />
    </EditorCard>
  );
};

export default DateTimeSelectFieldPro;
