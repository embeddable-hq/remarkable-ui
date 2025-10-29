import { FC, useEffect, useMemo, useRef, useState } from 'react';
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
import { IconSearch, IconSquare, IconSquareCheckFilled } from '@tabler/icons-react';
import { Button } from '../../../shared/Button/Button';
import styles from './MultiSelectField.module.css';
import { useSelectSearchFocus } from '../shared/useSelectSearchFocus.hook';
import { FormErrorMessage } from '../../../shared/FormErrorMessage/FormErrorMessage';

export type MultiSelectFieldProps = {
  disabled?: boolean;
  isClearable?: boolean;
  isLoading?: boolean;
  isSearchable?: boolean;
  noOptionsMessage?: string;
  options: SelectListOptionProps[];
  placeholder?: string;
  submitLabel?: string;
  values?: string[];
  onChange: (value: string[]) => void;
  onSearch?: (search: string) => void;
  error?: boolean;
  errorMessage?: string;
};

export const MultiSelectField: FC<MultiSelectFieldProps> = ({
  disabled,
  isClearable,
  isLoading,
  isSearchable,
  noOptionsMessage,
  options,
  placeholder,
  submitLabel = 'Apply',
  values = [],
  onChange,
  onSearch,
  error = false,
  errorMessage,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [preValues, setPreValues] = useState<string[]>(values);
  const [selectedLabel, setSelectedLabel] = useState<string>('');

  const searchFieldRef = useRef<HTMLInputElement>(null);
  useSelectSearchFocus(isOpen, searchFieldRef);

  useEffect(() => {
    setPreValues(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(values)]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!values || values.length === 0) {
      setSelectedLabel('');
      return;
    }
    const selectedOptions = values.map(
      (value) => options.find((o) => o.value === value)?.label ?? value,
    );

    if (selectedOptions.length > 0) {
      const newLabel = selectedOptions.join(', ');
      setSelectedLabel(`(${selectedOptions.length}) ${newLabel}`);
    }
  }, [values, options, isLoading]);

  const debouncedSearch = useMemo(() => (onSearch ? debounce(onSearch) : undefined), [onSearch]);

  const displayOptions =
    isSearchable && !onSearch
      ? options.filter((option) => option.label.toLowerCase().includes(searchValue.toLowerCase()))
      : options;

  const isSubmitDisabled =
    preValues.every((preValue) => values.includes(preValue)) &&
    values.every((value) => preValues.includes(value));

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

  const handleSearch = (newSearch: string) => {
    setSearchValue(newSearch);
    debouncedSearch?.(newSearch);
  };

  const handleSave = (newValues: string[]) => {
    onChange(newValues);
    setIsOpen(false);
    setSearchValue('');
    onSearch?.('');
  };

  const handleClearAll = () => {
    setSearchValue('');
    onSearch?.('');
    onChange([]);
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
            aria-label="Select options"
            placeholder={placeholder}
            disabled={disabled}
            valueLabel={selectedLabel}
            onClear={handleClearAll}
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
            {noOptionsMessage && (
              <SelectListOption disabled value="empty" label={noOptionsMessage} />
            )}
          </SelectListOptions>
          <Button
            className={styles.submitButton}
            disabled={isSubmitDisabled || isLoading}
            variant="primary"
            size="medium"
            onClick={() => handleSave(preValues)}
            role="button"
          >
            {submitLabel}
          </Button>
        </SelectList>
      </Dropdown>
      {errorMessage && <FormErrorMessage message={errorMessage} />}
    </div>
  );
};
