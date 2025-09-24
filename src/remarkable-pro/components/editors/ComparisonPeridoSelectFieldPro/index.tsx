import { useTheme } from '@embeddable.com/react';
import { SingleSelectField } from '../../../../remarkable-ui';
import { Theme } from '../../../theme/theme.types';
import { useLoadDayjsLocale } from '../../../utils.ts/date.utils';
import { TimeRange } from '@embeddable.com/core';
import { resolveI18nProps } from '../../component.utils';
import { EditorCard } from '../shared/EditorCard/EditorCard';
import { IconCalendarFilled } from '@tabler/icons-react';
import { i18n } from '../../../theme/i18n/i18n';
import { getDateComparisonSelectFieldProOptions } from './ComparisonPeriodSelectFieldPro.utils';
import { getTimeRangeFromTo } from '../editors.timeRange.utils';

type DateComparisonSelectFieldPro = {
  title?: string;
  description?: string;
  placeholder?: string;
  primaryDateRange?: TimeRange;
  comparisonPeriod?: string;
  onChange: (newComparisonPeriod: string) => void;
};

const DateComparisonSelectFieldPro = (props: DateComparisonSelectFieldPro) => {
  const theme: Theme = useTheme() as Theme;
  const { dayjsLocaleReady } = useLoadDayjsLocale();

  // Obtain the actual range for the selected primaryDateRange
  const primaryDateRange = getTimeRangeFromTo(props.primaryDateRange, theme);

  if (!dayjsLocaleReady) {
    return null;
  }

  const { description, placeholder, title, comparisonPeriod, onChange } = resolveI18nProps(props);

  const dateComparisonOptions = theme.editors.dateComparisonSelectFieldPro.options;
  const options = getDateComparisonSelectFieldProOptions(dateComparisonOptions, primaryDateRange);

  return (
    <EditorCard title={title} subtitle={description}>
      <SingleSelectField
        startIcon={IconCalendarFilled}
        isClearable
        placeholder={placeholder}
        value={comparisonPeriod}
        onChange={onChange}
        options={options}
        noOptionsMessage={i18n.t('common.noOptionsAvailable')}
      />
    </EditorCard>
  );
};

export default DateComparisonSelectFieldPro;
