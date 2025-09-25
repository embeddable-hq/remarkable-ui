import { useTheme } from '@embeddable.com/react';
import { SingleSelectField } from '../../../../remarkable-ui';
import { Theme } from '../../../theme/theme.types';
import { useLoadDayjsLocale } from '../../../utils.ts/date.utils';
import { TimeRange } from '@embeddable.com/core';
import { resolveI18nProps } from '../../component.utils';
import { EditorCard } from '../shared/EditorCard/EditorCard';
import { IconCalendarTime } from '@tabler/icons-react';
import { i18n, i18nSetup } from '../../../theme/i18n/i18n';
import {
  getComparisonPeriodSelectFieldProOptions,
  isComparisonPeriodAvailable,
} from './ComparisonPeriodSelectFieldPro.utils';
import { getTimeRangeFromTo } from '../editors.timeRange.utils';
import { useEffect, useMemo } from 'react';

type DateComparisonSelectFieldPro = {
  title?: string;
  description?: string;
  placeholder?: string;
  primaryDateRange?: TimeRange;
  comparisonPeriod?: string;
  onChange: (newComparisonPeriod?: string) => void;
};

const DateComparisonSelectFieldPro = (props: DateComparisonSelectFieldPro) => {
  const theme: Theme = useTheme() as Theme;
  i18nSetup(theme);

  const { description, placeholder, title, comparisonPeriod, onChange } = resolveI18nProps(props);

  const comparisonPeriodOptions = theme.editors.comparisonPeriodSelectFieldPro.options;

  const comparisonPeriodAvailable = useMemo(
    () => isComparisonPeriodAvailable(comparisonPeriod, comparisonPeriodOptions),
    [comparisonPeriod, comparisonPeriodOptions],
  );

  // If the current comparison period is not available, reset the field
  useEffect(() => {
    if (!comparisonPeriodAvailable) {
      onChange(undefined);
    }
  }, [comparisonPeriodAvailable, onChange]);

  const { dayjsLocaleReady } = useLoadDayjsLocale();

  // Obtain the actual range for the selected primaryDateRange
  const primaryDateRange = getTimeRangeFromTo(props.primaryDateRange, theme);

  if (!dayjsLocaleReady) {
    return null;
  }

  const options = getComparisonPeriodSelectFieldProOptions(
    comparisonPeriodOptions,
    primaryDateRange,
  );

  return (
    <EditorCard title={title} subtitle={description}>
      <SingleSelectField
        startIcon={IconCalendarTime}
        isClearable
        placeholder={placeholder}
        value={comparisonPeriodAvailable ? comparisonPeriod : undefined}
        onChange={onChange}
        options={options}
        noOptionsMessage={i18n.t('common.noOptionsAvailable')}
      />
    </EditorCard>
  );
};

export default DateComparisonSelectFieldPro;
