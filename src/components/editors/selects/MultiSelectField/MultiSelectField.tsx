import { FC, Fragment, useEffect, useMemo, useRef, useState } from 'react';
import {
  SelectListOption,
  SelectListOptionProps,
  SelectListOptionPropsWithCategory,
} from '../shared/SelectFieldContent/SelectFieldOptions/SelectFieldOption/SelectFieldOption';
import { Dropdown } from '../../../shared/Dropdown/Dropdown';
import { SelectFieldTrigger } from '../shared/SelectFieldTrigger/SelectFieldTrigger';
import {
  SelectFieldContent,
  SelectFieldContentList,
} from '../shared/SelectFieldContent/SelectFieldContent';
import { groupOptionsByCategory } from '../shared/SelectFieldContent/SelectFieldContent.utils';
import { IconProps, IconSearch, IconSquare, IconSquareCheckFilled } from '@tabler/icons-react';
import { Button } from '../../../shared/Button/Button';
import styles from '../selects.module.css';
import { useSelectSearchFocus } from '../shared/useSelectSearchFocus.hook';
import { SelectFieldCategory } from '../shared/SelectFieldContent/SelectFieldOptions/SelectFieldCategory/SelectFieldCategory';
import { FieldFeedback } from '../../../shared/Field/FieldFeedback';
import { FieldHeader, FieldHeaderProps } from '../../../shared/Field/FieldHeader';
import { TextField } from '../../inputs/TextField/TextField';
import { debounce } from '../../../../utils/debounce.utils';
import { SelectFieldValue } from '../selects.types';

export type MultiSelectFieldProps = {
  startIcon?: React.ComponentType<IconProps>;
  disabled?: boolean;
  isClearable?: boolean;
  isLoading?: boolean;
  isSearchable?: boolean;
  noOptionsMessage?: string;
  options: (SelectListOptionProps | SelectListOptionPropsWithCategory)[];
  placeholder?: string;
  submitLabel?: string;
  values?: SelectFieldValue[];
  avoidCollisions?: boolean;
  onChange: (value: SelectFieldValue[]) => void;
  onSearch?: (search: string) => void;
  error?: boolean;
  errorMessage?: string;
} & FieldHeaderProps;

export const MultiSelectField: FC<MultiSelectFieldProps> = ({
  startIcon,
  label,
  required,
  disabled,
  isClearable,
  isLoading,
  isSearchable,
  noOptionsMessage,
  options,
  placeholder,
  submitLabel = 'Apply',
  values = [],
  avoidCollisions,
  onChange,
  onSearch,
  error = false,
  errorMessage,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState<string>('');
  const [preValues, setPreValues] = useState<SelectFieldValue[]>(values);
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

  const groupedOptions = useMemo(() => groupOptionsByCategory(displayOptions), [displayOptions]);

  const isSubmitDisabled =
    preValues.every((preValue) => values.includes(preValue)) &&
    values.every((value) => preValues.includes(value));

  const handleSelectOption = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
    newValue?: SelectFieldValue,
  ) => {
    e.preventDefault();

    if (newValue == null) return;

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

  const handleSave = (newValues: SelectFieldValue[]) => {
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
        <SelectFieldContent>
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
                        onClick={(e) => handleSelectOption(e, option.value)}
                        startIcon={
                          preValues.includes(option.value!) ? (
                            <IconSquareCheckFilled />
                          ) : (
                            <IconSquare />
                          )
                        }
                        {...option}
                      />
                    ))}
                  </Fragment>
                ))
              : displayOptions.map((option) => (
                  <SelectListOption
                    key={option?.value ? option.value.toString() : option.label}
                    onClick={(e) => handleSelectOption(e, option.value)}
                    startIcon={
                      preValues.includes(option.value!) ? <IconSquareCheckFilled /> : <IconSquare />
                    }
                    {...option}
                  />
                ))}
            {noOptionsMessage && displayOptions.length === 0 && (
              <SelectListOption disabled value="empty" label={noOptionsMessage} />
            )}
          </SelectFieldContentList>
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
        </SelectFieldContent>
      </Dropdown>
      {errorMessage && <FieldFeedback message={errorMessage} variant="error" />}
    </div>
  );
};
