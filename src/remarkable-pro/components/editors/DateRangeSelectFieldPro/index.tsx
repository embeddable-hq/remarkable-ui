import { useTheme } from '@embeddable.com/react';
import { SingleSelectField } from '../../../../remarkable-ui';
import { Theme } from '../../../theme/theme.types';
import { useLoadDayjsLocale } from '../../../utils.ts/date.utils';
import { getDateRangeSelectFieldProOptions } from './DateRangeSelectFieldPro.utils';
import { TimeRange } from '@embeddable.com/core';
import { resolveI18nProps } from '../../component.utils';
import { EditorCard } from '../shared/EditorCard/EditorCard';
import { IconCalendarFilled } from '@tabler/icons-react';
import { i18n } from '../../../theme/i18n/i18n';
import { useEffect, useState } from 'react';

type DateRangeSelectFieldProProps = {
  description?: string;
  onChange: (newDateRange: TimeRange) => void;
  placeholder?: string;
  selectedValue: TimeRange;
  title?: string;
};

const DateRangeSelectFieldPro = (props: DateRangeSelectFieldProProps) => {
  const theme: Theme = useTheme() as Theme;
  const { dayjsLocaleReady } = useLoadDayjsLocale();

  const { selectedValue, onChange } = props;
  const [internalValue, setInternalValue] = useState<string | undefined>(
    selectedValue?.relativeTimeString,
  );

  // When updation the selectedValue in the builder, the defined value value can:
  // 1. exist in the options: relativeTimeString converted into TimeRange and onChange is called with the TimeRange
  // 2. not exist in the options: onChange is called with undefined (resets)

  const dateRangeOptions = theme.defaults.dateRangesOptions.filter((option) =>
    theme.editors.dateRangeSelectFieldPro.options.includes(option.value),
  );

  useEffect(() => {
    const relativeTimeString = selectedValue?.relativeTimeString;
    if (relativeTimeString === '') return;

    const matchedOption = dateRangeOptions.find((option) => option.value === relativeTimeString);

    console.log('internal value', matchedOption ? matchedOption.value : undefined);
    setInternalValue(matchedOption ? matchedOption.value : undefined);
  }, []);

  useEffect(() => {
    if (!selectedValue && !internalValue) return;

    const matchedOption = dateRangeOptions.find((option) => option.value === internalValue);

    const newChangeValue = matchedOption ? matchedOption.getRange() : undefined;

    onChange(newChangeValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [internalValue, dateRangeOptions]);

  if (!dayjsLocaleReady) {
    return null;
  }

  const { description, placeholder, title } = resolveI18nProps(props);

  const options = getDateRangeSelectFieldProOptions(dateRangeOptions);

  return (
    <EditorCard title={title} subtitle={description}>
      <SingleSelectField
        startIcon={IconCalendarFilled}
        isClearable
        placeholder={placeholder}
        value={internalValue}
        onChange={(value) => {
          console.log('set internal value', value);
          setInternalValue(value || undefined);
        }}
        options={options}
        noOptionsMessage={i18n.t('common.noOptionsAvailable')}
      />
    </EditorCard>
  );
};

export default DateRangeSelectFieldPro;
