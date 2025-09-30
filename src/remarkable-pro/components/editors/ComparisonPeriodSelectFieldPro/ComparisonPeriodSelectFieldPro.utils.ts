import { SelectListOptionProps } from '../../../../remarkable-ui';
import { TimeRange } from '@embeddable.com/core';
import { ComparisonPeriodSelectFieldProOption } from './ComparisonPeriodSelectFieldPro.types';
import { getTimeRangeLabel } from '../editors.timeRange.utils';
import { resolveI18nString } from '../../component.utils';
import { Theme } from '../../../theme/theme.types';
import { ComparisonPeriodOption } from '../../../theme/defaults/defaults.ComparisonPeriods.constants';

export const getAvailableComparisonPeriodSelectFieldProOptions = (
  theme: Theme,
): ComparisonPeriodSelectFieldProOption[] => {
  const comparisonPeriodSelectFieldProOption = theme.editors.comparisonPeriodSelectFieldPro.options;
  const defaultDateRangeOptions = theme.defaults.comparisonPeriodsOptions;

  const mergedOption = comparisonPeriodSelectFieldProOption.map((selectOption) => {
    const match: ComparisonPeriodOption | undefined = defaultDateRangeOptions.find(
      (option) => option.value === selectOption.value,
    );

    if (!match) return undefined;

    return {
      ...selectOption,
      ...match,
    };
  });

  return mergedOption.filter(Boolean) as ComparisonPeriodSelectFieldProOption[];
};

// Checks if the comparison period type is available in the embeddable types
export const isComparisonPeriodAvailable = (
  option: string | undefined,
  comparisonPeriodSelectFieldProOptions: ComparisonPeriodSelectFieldProOption[],
): boolean => {
  return !option || comparisonPeriodSelectFieldProOptions.some((opt) => opt.value === option);
};

export const getComparisonPeriodSelectFieldProOptions = (
  comparisonPeriodSelectFieldProOptions: ComparisonPeriodSelectFieldProOption[],
  toCompareTimeRange: TimeRange,
): SelectListOptionProps[] => {
  return comparisonPeriodSelectFieldProOptions.map((option) => {
    return {
      rightLabel: toCompareTimeRange
        ? getTimeRangeLabel(option.getRange(toCompareTimeRange), option.dateFormat)
        : '',
      value: option.value,
      label: resolveI18nString(option.label),
    };
  });
};
