import { DateRangeSelectFieldProOption } from './DateRangeSelectFieldPro.types';
import { SelectListOptionProps } from '../../../../remarkable-ui';
import { getTimeRangeLabel } from '../editors.timeRange.utils';

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
