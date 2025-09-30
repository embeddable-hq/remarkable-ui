import { DateRangeSelectFieldProOption } from './DateRangeSelectFieldPro.types';
import { SelectListOptionProps } from '../../../../remarkable-ui';
import { getTimeRangeLabel } from '../editors.timeRange.utils';
import { Theme } from '../../../theme/theme.types';
import { DateRangeOption } from '../../../theme/defaults/defaults.DateRanges.constants';

export const getAvailableDateRangeSelectFieldProOptions = (
  theme: Theme,
): DateRangeSelectFieldProOption[] => {
  const dateRangeSelectFieldProOption = theme.editors.dateRangeSelectFieldPro.options;
  const defaultDateRangeOptions = theme.defaults.dateRangesOptions;

  const mergedOption = dateRangeSelectFieldProOption.map((selectOption) => {
    const match: DateRangeOption | undefined = defaultDateRangeOptions.find(
      (option) => option.value === selectOption.value,
    );

    if (!match) return undefined;

    return {
      ...selectOption,
      ...match,
    };
  });

  return mergedOption.filter(Boolean) as DateRangeSelectFieldProOption[];
};

export const getDateRangeSelectFieldProOptions = (
  dateRangeSelectFieldProOptions: DateRangeSelectFieldProOption[],
): SelectListOptionProps[] => {
  return dateRangeSelectFieldProOptions.map((option) => {
    return {
      rightLabel: getTimeRangeLabel(option.getRange(), option.dateFormat),
      value: option.value,
      label: option.label,
    };
  });
};
