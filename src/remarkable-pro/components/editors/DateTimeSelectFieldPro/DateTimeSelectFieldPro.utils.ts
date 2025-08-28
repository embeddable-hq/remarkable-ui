import dayjs from 'dayjs';
import { DateTimeSelectFieldOptionGetRangeReturn } from './DateTimeSelectFieldPro.types';
import { Theme } from '../../../theme/theme.types';
import { SelectListOptionProps } from '../../../../remarkable-ui/editors/select/shared/SelectList/SelectListOptions/SelectListOption/SelectListOption';
import { dateTimeSelectFieldDefaultOptions } from './DateTimeSelectFieldPro.constants';

export const getDateTimeSelectFieldProRangeLabel = (
  range: DateTimeSelectFieldOptionGetRangeReturn,
  dateFormat: string,
): string => {
  const { from, to } = range;
  const labelFrom = dayjs(from).format(dateFormat);
  const labelTo = dayjs(to).format(dateFormat);

  if (labelFrom === labelTo) {
    return labelFrom;
  }

  return `${labelFrom} - ${labelTo}`;
};

export const getDateTimeSelectFieldProOptions = (theme: Theme): SelectListOptionProps[] => {
  const dateTimeSelectFieldOptions =
    theme.editors?.dateTimeSelectFieldOverrides?.options ?? dateTimeSelectFieldDefaultOptions;

  return dateTimeSelectFieldOptions.map((option) => {
    return {
      value: option.value,
      label: `${option.label} ${
        option.getRange && option.dateFormat
          ? getDateTimeSelectFieldProRangeLabel(option.getRange(), option.dateFormat)
          : ''
      }`,
    };
  });
};
