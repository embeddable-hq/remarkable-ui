import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { TextField } from '../../TextField/TextField';
import { SelectButton } from '../shared/SelectButton/SelectButton';
import { Dropdown } from '../../../shared/Dropdown/Dropdown';
import { SelectList } from '../shared/SelectList/SelectList';
import { SelectListOptions } from '../shared/SelectList/SelectListOptions/SelectListOptions';
import {
  SelectListOption,
  SelectListOptionProps,
  SelectListOptionPropsWithCategory,
} from '../shared/SelectList/SelectListOptions/SelectListOption/SelectListOption';
import { SelectListCategory } from '../shared/SelectList/SelectListOptions/SelectListCategory/SelectListCategory';
import { groupOptionsByCategory } from '../shared/SelectList/selectList.utils';
import { debounce } from '../../../utils/debounce.utils';
import { IconSearch, TablerIcon } from '@tabler/icons-react';
import { useSelectSearchFocus } from '../shared/useSelectSearchFocus.hook';
import styles from './SingleSelectField.module.css';
import { FieldErrorMessage } from '../../../shared/FieldErrorMessage/FieldErrorMessage';

export type SingleSelectFieldProps = {
  options: (SelectListOptionProps | SelectListOptionPropsWithCategory)[];
  startIcon?: TablerIcon;
  value?: string;
  disabled?: boolean;
  placeholder?: string;
  isSearchable?: boolean;
  isClearable?: boolean;
  isLoading?: boolean;
  noOptionsMessage?: string;
  stickyCategoryLabels?: boolean;
  onChange: (value: string) => void;
  onSearch?: (search: string) => void;
  error?: boolean;
  errorMessage?: string;
};

export const SingleSelectField: FC<SingleSelectFieldProps> = ({
  value = '',
  startIcon,
  options,
  disabled,
  placeholder,
  isSearchable,
  isClearable,
  isLoading,
  noOptionsMessage = 'No options available',
  stickyCategoryLabels = false,
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
    isSearchable && !onSearch
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
    <div className={styles.selectField}>
      <Dropdown
        open={isOpen}
        onOpenChange={setIsOpen}
        disabled={disabled}
        triggerComponent={
          <SelectButton
            startIcon={startIcon}
            aria-label="Select option"
            placeholder={placeholder}
            disabled={disabled}
            valueLabel={selectedLabel}
            onClear={() => handleChange('')}
            isClearable={isClearable}
            isLoading={isLoading}
            error={hasError}
          />
        }
      >
        <SelectList>
          {isSearchable && (
            <TextField
              ref={searchFieldRef}
              startIcon={IconSearch}
              aria-label="Search options"
              placeholder="Search…"
              role="searchbox"
              value={searchValue}
              onKeyDown={(e) => e.stopPropagation()}
              onChange={handleSearch}
            />
          )}
          <SelectListOptions disabled={isLoading}>
            {groupedOptions
              ? Object.entries(groupedOptions).map(([category, categoryOptions]) => (
                  <div key={category}>
                    <SelectListCategory label={category} sticky={stickyCategoryLabels} />
                    {categoryOptions.map((option) => (
                      <SelectListOption
                        key={option?.value ?? option.label}
                        onClick={() => handleChange(option?.value)}
                        isSelected={option.value === value}
                        {...option}
                      />
                    ))}
                  </div>
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
          </SelectListOptions>
        </SelectList>
      </Dropdown>
      {errorMessage && <FieldErrorMessage message={errorMessage} />}
    </div>
  );
};
