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
import { IconSearch, TablerIcon } from '@tabler/icons-react';
import { useSelectSearchFocus } from '../shared/useSelectSearchFocus.hook';
import { FieldHeader, FieldHeaderProps } from '../../../shared/Field/FieldHeader';
import styles from '../selects.module.css';
import { FieldFeedback } from '../../../shared/Field/FieldFeedback';
import { TextField } from '../../inputs/TextField/TextField';
import { debounce } from '../../../../utils/debounce.utils';

export type SingleSelectFieldProps = {
  options: (SelectListOptionProps | SelectListOptionPropsWithCategory)[];
  startIcon?: TablerIcon;
  value?: string;
  disabled?: boolean;
  placeholder?: string;
  searchable?: boolean;
  clearable?: boolean;
  isLoading?: boolean;
  noOptionsMessage?: string;
  onChange: (value: string) => void;
  onSearch?: (search: string) => void;
  error?: boolean;
  errorMessage?: string;
} & FieldHeaderProps;

export const SingleSelectField: FC<SingleSelectFieldProps> = ({
  label,
  required,
  value = '',
  startIcon,
  options,
  disabled,
  placeholder,
  searchable,
  clearable,
  isLoading,
  noOptionsMessage = 'No options available',
  onChange,
  onSearch,
  error = false,
  errorMessage,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedLabel, setSelectedLabel] = useState<string>(value);

  const searchFieldRef = useRef<HTMLInputElement>(null);
  useSelectSearchFocus(isOpen, searchFieldRef);

  useEffect(() => {
    if (!value) {
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

  const handleChange = (newValue?: string) => {
    setSearchValue('');
    onChange(newValue ?? '');
    onSearch?.('');

    if (newValue === '') {
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

  const hasError = error || !!errorMessage;

  return (
    <div>
      <FieldHeader label={label} required={required} />
      <Dropdown
        open={isOpen}
        onOpenChange={setIsOpen}
        disabled={disabled}
        triggerComponent={
          <SelectFieldTrigger
            startIcon={startIcon}
            aria-label="Select option"
            placeholder={placeholder}
            disabled={disabled}
            valueLabel={selectedLabel}
            onClear={() => handleChange('')}
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
                        key={option?.value ?? option.label}
                        onClick={() => handleChange(option?.value)}
                        isSelected={option.value === value}
                        {...option}
                      />
                    ))}
                  </Fragment>
                ))
              : displayOptions.map((option) => (
                  <SelectListOption
                    key={option?.value ?? option.label}
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
