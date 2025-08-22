import { FC, useEffect, useMemo, useState } from 'react';
import {
  SelectListOption,
  SelectListOptionProps,
} from '../shared/SelectList/SelectListOptions/SelectListOption/SelectListOption';
import { debounce } from '../../../utils/debounce.utils';
import { Dropdown } from '../../../shared/Dropdown/Dropdown';
import { SelectButton } from '../shared/SelectButton/SelectButton';
import { SelectList } from '../shared/SelectList/SelectList';
import { TextField } from '../../TextField/TextField';
import { SelectListOptions } from '../shared/SelectList/SelectListOptions/SelectListOptions';
import { IconSquare, IconSquareCheck } from '@tabler/icons-react';

export type MultiSelectFieldProps = {
  options: SelectListOptionProps[];
  value?: string[];
  disabled?: boolean;
  placeholder?: string;
  isSearchable?: boolean;
  isClearable?: boolean;
  isLoading?: boolean;
  noOptionsMessage?: string;
  onChange: (value: string[]) => void;
  onSearch?: (search: string) => void;
};

export const MultiSelectField: FC<MultiSelectFieldProps> = ({
  value = [],
  options,
  disabled,
  placeholder,
  isSearchable,
  isClearable,
  isLoading,
  noOptionsMessage,
  onChange,
  onSearch,
}) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [selectedLabel, setSelectedLabel] = useState<string[]>(value);

  const debouncedSearch = useMemo(() => (onSearch ? debounce(onSearch) : undefined), [onSearch]);

  const displayOptions =
    isSearchable && !onSearch
      ? options.filter((option) => option.label.toLowerCase().includes(searchValue.toLowerCase()))
      : options;

  const handleSelect = (newValue: string) => {
    if (value.includes(newValue)) {
      onChange(value.filter((v) => v !== newValue));
    } else {
      onChange([...value, newValue]);
    }
  };

  const handleSearch = (newSearch: string) => {
    setSearchValue(newSearch);
    debouncedSearch?.(newSearch);
  };

  const valueLabel = value.length === 0 ? undefined : `(${value.length})`;

  return (
    <Dropdown
      disabled={disabled}
      triggerComponent={
        <SelectButton
          aria-label="Select option"
          placeholder={placeholder}
          disabled={disabled}
          valueLabel={valueLabel}
          onClear={() => handleSelect('')}
          isClearable={isClearable}
          isLoading={isLoading}
        />
      }
    >
      <SelectList>
        {isSearchable && (
          <TextField
            autoFocus
            aria-label="Search options"
            role="menuitem"
            value={searchValue}
            onKeyDown={(e) => e.stopPropagation()}
            onChange={handleSearch}
          />
        )}
        <SelectListOptions disabled={isLoading}>
          {displayOptions.map((option) => (
            <SelectListOption
              key={option?.value ?? option.label}
              onClick={(e) => {
                e.preventDefault();
                handleSelect(option.value!);
              }}
              startIcon={value.includes(option.value!) ? <IconSquareCheck /> : <IconSquare />}
              {...option}
            />
          ))}
          {noOptionsMessage && <SelectListOption disabled value="empty" label={noOptionsMessage} />}
        </SelectListOptions>
      </SelectList>
    </Dropdown>
  );
};
