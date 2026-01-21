import { FC, Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { SelectFieldTrigger } from '../shared/SelectFieldTrigger/SelectFieldTrigger';
import { Dropdown } from '../../../shared/Dropdown/Dropdown';
import {
  SelectFieldContent,
  SelectFieldContentList,
} from '../shared/SelectFieldContent/SelectFieldContent';
import {
  SelectListOption,
  SelectListOptionProps,
  SelectListOptionPropsWithCategory,
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
import { SelectFieldValue } from '../selects.types';

export type SingleSelectFieldProps = {
  options: (SelectListOptionProps | SelectListOptionPropsWithCategory)[];
  startIcon?: React.ComponentType<IconProps>;
  value?: SelectFieldValue;
  disabled?: boolean;
  placeholder?: string;
  searchable?: boolean;
  clearable?: boolean;
  isLoading?: boolean;
  noOptionsMessage?: string;
  onChange: (value: SelectFieldValue) => void;
  onSearch?: (search: string) => void;
  error?: boolean;
  errorMessage?: string;
  avoidCollisions?: boolean;
} & FieldHeaderProps;

export const SingleSelectField: FC<SingleSelectFieldProps> = ({
  label,
  required,
  value,
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
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedLabel, setSelectedLabel] = useState<string>(value?.toString() ?? '');

  const searchFieldRef = useRef<HTMLInputElement>(null);
  useSelectSearchFocus(isOpen, searchFieldRef);

  useEffect(() => {
    if (value == null) {
      setSelectedLabel('');
      return;
    }

    const selectedOption = options.find((opt) => opt.value === value);
    if (selectedOption) {
      setSelectedLabel(selectedOption.label);
    } else {
      setSelectedLabel('');
    }
  }, [value, options]);

  const debouncedSearch = useMemo(() => (onSearch ? debounce(onSearch) : undefined), [onSearch]);

  const displayOptions =
    searchable && !onSearch
      ? options.filter((option) => option.label.toLowerCase().includes(searchValue.toLowerCase()))
      : options;

  const groupedOptions = useMemo(() => groupOptionsByCategory(displayOptions), [displayOptions]);

  const handleChange = (newValue?: SelectFieldValue) => {
    setSearchValue('');
    onChange(newValue);
    onSearch?.('');

    const selectedOption = options.find((opt) => opt.value === newValue);
    if (selectedOption) {
      setSelectedLabel(selectedOption.label);
    } else {
      setSelectedLabel('');
    }
  };

  const handleSearch = (newSearch: string) => {
    setSearchValue(newSearch);
    debouncedSearch?.(newSearch);
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
        triggerComponent={
          <SelectFieldTrigger
            startIcon={startIcon}
            aria-label="Select option"
            placeholder={placeholder}
            disabled={disabled}
            valueLabel={selectedLabel}
            onClear={() => handleChange(undefined)}
            isClearable={clearable}
            isLoading={isLoading}
            error={hasError}
          />
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
                    {categoryOptions.map((option) => (
                      <SelectListOption
                        key={option?.value ? option.value.toString() : option.label}
                        onClick={() => handleChange(option?.value)}
                        isSelected={option.value === value}
                        {...option}
                      />
                    ))}
                  </Fragment>
                ))
              : displayOptions.map((option) => (
                  <SelectListOption
                    key={option?.value ? option.value.toString() : option.label}
                    onClick={() => handleChange(option?.value)}
                    isSelected={option.value === value}
                    {...option}
                  />
                ))}
            {options.length === 0 && (
              <SelectListOption disabled value="empty" label={noOptionsMessage} />
            )}
          </SelectFieldContentList>
        </SelectFieldContent>
      </Dropdown>
      {errorMessage && <FieldFeedback message={errorMessage} variant="error" />}
    </div>
  );
};
