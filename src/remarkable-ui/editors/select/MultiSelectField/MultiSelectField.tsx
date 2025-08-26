import { FC, useMemo, useState } from 'react';
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
import { IconSquare, IconSquareCheckFilled } from '@tabler/icons-react';
import { Button } from '../../../shared/Button/Button';
import styles from './MultiSelectField.module.css';

export type MultiSelectFieldProps = {
  options: SelectListOptionProps[];
  values?: string[];
  disabled?: boolean;
  placeholder?: string;
  isSearchable?: boolean;
  isClearable?: boolean;
  isLoading?: boolean;
  noOptionsMessage?: string;
  submitLabel?: string;
  onChange: (value: string[]) => void;
  onSearch?: (search: string) => void;
};

export const MultiSelectField: FC<MultiSelectFieldProps> = ({
  values = [],
  submitLabel = 'Apply',
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
  const [preValues, setPreValues] = useState<string[]>(values);

  const debouncedSearch = useMemo(() => (onSearch ? debounce(onSearch) : undefined), [onSearch]);

  const displayOptions =
    isSearchable && !onSearch
      ? options.filter((option) => option.label.toLowerCase().includes(searchValue.toLowerCase()))
      : options;

  const handleSearch = (newSearch: string) => {
    setSearchValue(newSearch);
    debouncedSearch?.(newSearch);
  };

  const valueLabel = values.length === 0 ? undefined : `(${values.length}) ${values.join(', ')}`;

  const handleSelectOption = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    newValue?: string,
  ) => {
    e.preventDefault();

    if (!newValue) return;

    if (preValues.includes(newValue)) {
      setPreValues(preValues.filter((v) => v !== newValue));
    } else {
      setPreValues([...preValues, newValue]);
    }
  };

  const isSumitDisabled =
    preValues.every((p) => values.includes(p)) && values.every((p) => preValues.includes(p));

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  const handleSave = (newValues: string[]) => {
    onChange(newValues);
    setIsOpen(false);
  };

  return (
    <Dropdown
      open={isOpen}
      onOpenChange={handleOpenChange}
      disabled={disabled}
      triggerComponent={
        <SelectButton
          aria-label="Select option"
          placeholder={placeholder}
          disabled={disabled}
          valueLabel={valueLabel}
          onClear={() => handleSave([])}
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
              onClick={(e) => handleSelectOption(e, option.value)}
              startIcon={
                preValues.includes(option.value!) ? <IconSquareCheckFilled /> : <IconSquare />
              }
              {...option}
            />
          ))}
          {noOptionsMessage && <SelectListOption disabled value="empty" label={noOptionsMessage} />}
        </SelectListOptions>
        <Button
          className={styles.submitButton}
          disabled={isSumitDisabled}
          variant="primary"
          size="medium"
          onClick={() => handleSave(preValues)}
        >
          {submitLabel}
        </Button>
      </SelectList>
    </Dropdown>
  );
};
