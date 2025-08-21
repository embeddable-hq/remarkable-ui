import { FC, useState } from 'react';
import { TextField } from '../../TextField/TextField';
import { SelectButton } from '../shared/SelectButton/SelectButton';
import {
  SelectListItem,
  SelectListItemProps,
} from '../shared/SelectList/SelectListItem/SelectListItem';
import { Dropdown } from '../../../shared/Dropdown/Dropdown';
import { SelectList } from '../shared/SelectList/SelectList';

export type SingleSelectFieldProps = {
  value?: string;
  onChange: (value: string) => void;
  options: SelectListItemProps[];
  isSearchable?: boolean;
  isClearable?: boolean;
  disabled?: boolean;
};

export const SingleSelectField: FC<SingleSelectFieldProps> = ({
  value = '',
  options,
  disabled,
  isSearchable,
  isClearable,
  onChange,
}) => {
  const [searchValue, setSearchValue] = useState<string>('');

  const valueLabel = options.find((option) => option.value === value)?.label;

  const displayOptions = isSearchable
    ? options.filter((option) => option.label.toLowerCase().includes(searchValue.toLowerCase()))
    : options;

  const handleChange = (newValue?: string) => {
    setSearchValue('');
    onChange(newValue ?? '');
  };

  return (
    <Dropdown
      disabled={disabled}
      triggerComponent={
        <SelectButton
          disabled={disabled}
          valueLabel={valueLabel}
          onClear={() => handleChange('')}
          isClearable={isClearable}
        />
      }
    >
      <SelectList autoFocus>
        {isSearchable && (
          <TextField
            role="menuitem" // Includes role for accessibility (navigation)
            value={searchValue}
            onKeyDown={(e) => e.stopPropagation()}
            onChange={(newSearch) => setSearchValue(newSearch)}
          />
        )}
        {displayOptions.map((option) => (
          <SelectListItem
            key={option?.value ?? option.label}
            onClick={() => handleChange(option?.value)}
            {...option}
          />
        ))}
      </SelectList>
    </Dropdown>
  );
};
