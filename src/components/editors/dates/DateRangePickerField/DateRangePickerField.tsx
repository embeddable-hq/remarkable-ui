import { FC, useState } from 'react';
import { FieldHeader, FieldHeaderProps } from '../../../shared/Field/FieldHeader';
import { Dropdown } from '../../../shared/Dropdown/Dropdown';
import { SelectFieldTrigger } from '../../selects/shared/SelectFieldTrigger/SelectFieldTrigger';
import { IconProps } from '@tabler/icons-react';
import { SelectFieldContent } from '../../selects/shared/SelectFieldContent/SelectFieldContent';
import { FieldFeedback } from '../../../shared/Field/FieldFeedback';
import { DateRangePicker, DateRangePickerProps } from '../DateRangePicker/DateRangePicker';
import { DateRange } from 'react-day-picker';
import { Button } from '../../../shared/Button/Button';
import styles from './DateRangePickerField.module.css';
import { isSameDateRange } from '../../../../utils/date.utils';

type DateRangePickerFieldProps = {
  displayValue?: string;
  startIcon?: React.ComponentType<IconProps>;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  errorMessage?: string;
  clearable?: boolean;
  onChange: (dateRange: DateRange | undefined) => void;
  submitLabel?: string;
  avoidCollisions?: boolean;
} & FieldHeaderProps &
  DateRangePickerProps;

const getDateRangePickerLabel = (
  dateRange: DateRange | undefined,
  displayValue?: string,
): string | undefined => {
  if (!dateRange) return undefined;

  if (displayValue || displayValue === '') return displayValue;

  const { from, to } = dateRange;

  if (!from || !to) return undefined;

  return `${from ? from.toLocaleDateString() : ''} - ${to ? to.toLocaleDateString() : ''}`;
};

export const DateRangePickerField: FC<DateRangePickerFieldProps> = ({
  locale,
  displayValue,
  value,
  startIcon,
  label,
  disabled,
  placeholder,
  required,
  error,
  errorMessage,
  clearable,
  numberOfMonths = 1,
  submitLabel = 'Apply',
  avoidCollisions,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDateRange, setCurrentDateRange] = useState<DateRange | undefined>(value);

  const valueLabel = getDateRangePickerLabel(value, displayValue);
  const hasError = error || !!errorMessage;

  const handleChange = () => {
    onChange(currentDateRange);
    setIsOpen(false);
  };

  const handleClear = () => {
    setCurrentDateRange(undefined);
    onChange(undefined);
  };

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setIsOpen(true);
      return;
    }
    setCurrentDateRange(value);
    setIsOpen(false);
  };

  const isSubmitDisabled = isSameDateRange(currentDateRange, value);

  return (
    <div>
      <FieldHeader label={label} required={required} />
      <Dropdown
        open={isOpen}
        onOpenChange={handleOpenChange}
        disabled={disabled}
        avoidCollisions={avoidCollisions}
        triggerComponent={
          <SelectFieldTrigger
            startIcon={startIcon}
            aria-label="Select options"
            placeholder={placeholder}
            disabled={disabled}
            valueLabel={valueLabel}
            onClear={handleClear}
            isClearable={clearable}
            error={hasError}
          />
        }
      >
        <SelectFieldContent fitContent>
          <DateRangePicker
            locale={locale}
            numberOfMonths={numberOfMonths}
            value={currentDateRange}
            onChange={setCurrentDateRange}
          />
          <Button
            size="small"
            className={styles.submitButton}
            onClick={handleChange}
            disabled={isSubmitDisabled}
          >
            {submitLabel}
          </Button>
        </SelectFieldContent>
      </Dropdown>
      {errorMessage && <FieldFeedback message={errorMessage} variant="error" />}
    </div>
  );
};
