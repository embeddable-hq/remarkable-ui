import { TimeRange } from '@embeddable.com/core';
import { Theme } from '../../theme/theme.types';
import { resolveI18nString } from '../component.utils';

export const getComparisonPeriodDateRange = (
  primaryDateRange: TimeRange,
  comparisonPeriod: string | undefined,
  theme: Theme,
): TimeRange => {
  if (!primaryDateRange || !comparisonPeriod) {
    return undefined;
  }

  const primaryDateRangeRange = primaryDateRange?.relativeTimeString
    ? theme.defaults.dateRangesOptions
        .find((option) => option.value === primaryDateRange?.relativeTimeString)
        ?.getRange()
    : primaryDateRange;

  const comparisonPeriodOption = theme.defaults.comparisonPeriodsOptions.find(
    (option) => option.value === comparisonPeriod,
  );

  return comparisonPeriodOption?.getRange(primaryDateRangeRange);
};

export const getComparisonPeriodLabel = (
  comparisonPeriod: string | undefined,
  theme: Theme,
): string => {
  const option = theme.defaults.comparisonPeriodsOptions.find(
    (option) => option.value === comparisonPeriod,
  );
  return option ? resolveI18nString(option.label) : '';
};
