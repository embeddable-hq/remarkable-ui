import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { SelectFieldTrigger } from '../shared/SelectFieldTrigger/SelectFieldTrigger';
import { Dropdown, DropdownProps } from '../../../shared/Dropdown/Dropdown';
import {
  SelectFieldContent,
  SelectFieldContentList,
} from '../shared/SelectFieldContent/SelectFieldContent';
import {
  SelectListOption,
  SelectListOptionProps,
} from '../shared/SelectFieldContent/SelectFieldOptions/SelectFieldOption/SelectFieldOption';
import { SelectFieldCategory } from '../shared/SelectFieldContent/SelectFieldOptions/SelectFieldCategory/SelectFieldCategory';
import { groupOptionsByCategory } from '../shared/SelectFieldContent/SelectFieldContent.utils';
import { IconProps, IconSearch } from '@tabler/icons-react';
import { useSelectSearchFocus } from '../shared/useSelectSearchFocus.hook';
import { FieldHeader, FieldHeaderProps } from '../../../shared/Field/FieldHeader';
import styles from '../selects.module.css';
import { FieldFeedback } from '../../../shared/Field/FieldFeedback';
import { TextField } from '../../inputs/TextField/TextField';
import { debounce } from '../../../../utils/debounce.utils';

export type SelectOptionValue = string | number | boolean;

export type SingleSelectFieldProps<T extends SelectOptionValue> = {
  options: SelectListOptionProps<T>[];
  startIcon?: React.ComponentType<IconProps>;
  value?: T | null;
  disabled?: boolean;
  placeholder?: string;
  searchable?: boolean;
  clearable?: boolean;
  isLoading?: boolean;
  noOptionsMessage?: string;
  onChange: (value: T | null) => void;
  onSearch?: (search: string) => void;
  error?: boolean;
  errorMessage?: string;
  avoidCollisions?: boolean;
  variant?: 'default' | 'ghost';
  triggerComponent?: React.ReactNode;
} & FieldHeaderProps &
  Pick<DropdownProps, 'side' | 'align'>;

export function SingleSelectField<T extends SelectOptionValue>({
  label,
  required,
  value = null,
  startIcon,
  options,
  disabled,
  placeholder,
  searchable,
  clearable,
  isLoading,
  avoidCollisions,
  noOptionsMessage = 'No options available',
  onChange,
  onSearch,
  error = false,
  errorMessage,
  side,
  align,
  variant,
  triggerComponent,
}: SingleSelectFieldProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedLabel, setSelectedLabel] = useState<string>('');

  const searchFieldRef = useRef<HTMLInputElement>(null);
  useSelectSearchFocus(isOpen, searchFieldRef);

  useEffect(() => {
    if (value === null) {
      setSelectedLabel('');
      return;
    }

    const option = options.find((opt) => opt.value === value);
    if (option) {
      setSelectedLabel(option.label);
    }
  }, [value, options]);

  const debouncedSearch = useMemo(() => (onSearch ? debounce(onSearch) : undefined), [onSearch]);

  const displayOptions =
    searchable && !onSearch
      ? options.filter((option) => option.label.toLowerCase().includes(searchValue.toLowerCase()))
      : options;

  const groupedOptions = useMemo(() => groupOptionsByCategory(displayOptions), [displayOptions]);

  const handleChange = (newValue: T | null) => {
    setSearchValue('');
    onChange(newValue);
    onSearch?.('');

    if (newValue === null) {
      setSelectedLabel('');
    } else {
      const option = options.find((opt) => opt.value === newValue);
      if (option) setSelectedLabel(option.label);
    }
  };

  const handleSearch = (newSearch: string) => {
    setSearchValue(newSearch);
    debouncedSearch?.(newSearch);
  };

  const renderOption = (option: SelectListOptionProps<T> & { category?: string }) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { value: optionValue, category: _category, ...optionRest } = option;
    return (
      <SelectListOption
        key={String(optionValue)}
        value={String(optionValue)}
        onClick={() => handleChange(optionValue ?? null)}
        isSelected={optionValue === value}
        {...optionRest}
      />
    );
  };

  const hasError = error || !!errorMessage;
  return (
    <div>
      <FieldHeader label={label} required={required} />
      <Dropdown
        open={isOpen}
        onOpenChange={setIsOpen}
        disabled={disabled}
        avoidCollisions={avoidCollisions}
        side={side}
        align={align}
        triggerComponent={
          triggerComponent ?? (
            <SelectFieldTrigger
              startIcon={startIcon}
              aria-label="Select option"
              placeholder={placeholder}
              disabled={disabled}
              valueLabel={selectedLabel}
              onClear={() => handleChange(null)}
              isClearable={clearable}
              isLoading={isLoading}
              error={hasError}
              variant={variant}
            />
          )
        }
      >
        <SelectFieldContent>
          {searchable && (
            <TextField
              ref={searchFieldRef}
              startIcon={IconSearch}
              aria-label="Search options"
              placeholder="Search…"
              role="searchbox"
              value={searchValue}
              onKeyDown={(e) => e.stopPropagation()}
              onChange={handleSearch}
              className={styles.searchField}
            />
          )}
          <SelectFieldContentList disabled={isLoading}>
            {groupedOptions
              ? Object.entries(groupedOptions).map(([category, categoryOptions]) => (
                  <Fragment key={category}>
                    <SelectFieldCategory label={category} />
                    {categoryOptions.map(renderOption)}
                  </Fragment>
                ))
              : displayOptions.map(renderOption)}
            {options.length === 0 && (
              <SelectListOption disabled value="empty" label={noOptionsMessage} />
            )}
          </SelectFieldContentList>
        </SelectFieldContent>
      </Dropdown>
      {errorMessage && <FieldFeedback message={errorMessage} variant="error" />}
    </div>
  );
}
