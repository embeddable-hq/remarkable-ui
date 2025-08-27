import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { TextField } from '../../TextField/TextField';
import { SelectButton } from '../shared/SelectButton/SelectButton';
import { Dropdown } from '../../../shared/Dropdown/Dropdown';
import { SelectList } from '../shared/SelectList/SelectList';
import { SelectListOptions } from '../shared/SelectList/SelectListOptions/SelectListOptions';
import {
  SelectListOption,
  SelectListOptionProps,
} from '../shared/SelectList/SelectListOptions/SelectListOption/SelectListOption';
import { debounce } from '../../../utils/debounce.utils';
import { IconSearch } from '@tabler/icons-react';
import { useSelectSearchFocus } from '../shared/useSelectSearchFocus.hook';

export type SingleSelectFieldProps = {
  options: SelectListOptionProps[];
  value?: string;
  disabled?: boolean;
  placeholder?: string;
  isSearchable?: boolean;
  isClearable?: boolean;
  isLoading?: boolean;
  noOptionsMessage?: string;
  onChange: (value: string) => void;
  onSearch?: (search: string) => void;
};

export const SingleSelectField: FC<SingleSelectFieldProps> = ({
  value = '',
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

  return (
    <Dropdown
      open={isOpen}
      onOpenChange={setIsOpen}
      disabled={disabled}
      triggerComponent={
        <SelectButton
          aria-label="Select option"
          placeholder={placeholder}
          disabled={disabled}
          valueLabel={selectedLabel}
          onClear={() => handleChange('')}
          isClearable={isClearable}
          isLoading={isLoading}
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
          {displayOptions.map((option) => (
            <SelectListOption
              key={option?.value ?? option.label}
              onClick={() => handleChange(option?.value)}
              {...option}
            />
          ))}
          {noOptionsMessage && <SelectListOption disabled value="empty" label={noOptionsMessage} />}
        </SelectListOptions>
      </SelectList>
    </Dropdown>
  );
};
