import { TimeRange } from '@embeddable.com/core';
import { Theme } from '../../theme/theme.types';
import { resolveI18nString } from '../component.utils';

export const getComparisonPeriodDateRange = (
  primaryDateRange: TimeRange,
  comparisonPeriod: string | undefined,
  theme: Theme,
): TimeRange => {
  const primaryDateRangeRange = primaryDateRange?.relativeTimeString
    ? theme.defaults.dateRanges
        .find((option) => option.value === primaryDateRange?.relativeTimeString)
        ?.getRange()
    : primaryDateRange;

  const compariosonPeriodOption = theme.defaults.comparisonPeriods.find(
    (option) => option.value === comparisonPeriod,
  );

  return compariosonPeriodOption?.getRange(primaryDateRangeRange);
};

export const getComparisonPeriodLabel = (
  comparisonPeriod: string | undefined,
  theme: Theme,
): string => {
  const option = theme.defaults.comparisonPeriods.find(
    (option) => option.value === comparisonPeriod,
  );
  return option ? resolveI18nString(option.label) : '';
};
