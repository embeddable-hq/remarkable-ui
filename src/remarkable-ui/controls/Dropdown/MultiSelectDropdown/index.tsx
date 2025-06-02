// Third Party Libraries
import React, { useState, useEffect } from 'react';

// Local Libraries
import { MultiSelectDropdownProps } from './MultiSelectDropdown.emb';
import ControlCard from '../../../shared/ControlCard'
import Dropdown, { DropdownItem } from '../../../shared/BaseDropdown';
import MultiSelectDropdownButton from './MultiSelectDropdownButton';
import { CheckboxIcon, CheckboxSelectedIcon } from '../../../constants/icons';

export default ({
    description, 
    dimension,
    onChangeSelectedValues,
    placeholder,
    preSelectedValues,
    results,
    setSearchValue,
    title,
}: MultiSelectDropdownProps) => {

    const [selected, setSelected] = useState(() => new Set(preSelectedValues));

    const { isLoading, data = [], error } = results;

    const preSelectedValuesList = preSelectedValues ?? [];
    const selectedValues = Array.from(selected);

    //check if the selected values are the same as the pre-selected values, and if so, disable the apply button
    const disableApplyButton = isLoading || (
          selectedValues.length === preSelectedValuesList.length &&
          selectedValues.every(v => preSelectedValuesList.includes(v))
    );
    
    //toggle the values as users select/deselect values
    const toggleValue = (value:string) => {
        setSelected((prev) => {
            const next = new Set(prev); // make a *new* Set (don’t mutate)
            next.has(value) ? next.delete(value) : next.add(value);
            return next;
        });
    }

    //clear the selected values and send the empty array to Embeddable
    const clearSelectedValues = () => {
        setSelected(new Set());
        onChangeSelectedValues?.([]);
    }

    //send the selected values to Embeddable when the users clicks the apply button
    const handleApplyClick = () => {
        onChangeSelectedValues?.(selectedValues as string[]);
    }
    
    const buildDropdownItem = (value: string, index:number):DropdownItem => {
        return {
            id: `multiselect-dropdown-${value}-${index}`,
            label: `${value}`,
            icon: selected.has(value) ? CheckboxSelectedIcon : CheckboxIcon,
            onClick: () => toggleValue(value),
        }
    }
    
    //Populate dropdown items
    const dropdownItems = data.length > 0 
        ? data.map((row, i) => {
            const label = row[dimension.name];
            return buildDropdownItem(label, i);
        }) 
        : [{ //'No results' item
            id: `multiselect-dropdown-no-results`,
            label: `No results found`,
        }];

    return (
        <ControlCard
            title={title}
            description={description}
            errorMessage={error}
        >          
            <Dropdown
                items={dropdownItems}
                align='left'
                closeDropdownOnItemClick={false}
                onSearch={setSearchValue}
                onApply={handleApplyClick}
                disableApply={disableApplyButton}
            >              
                <MultiSelectDropdownButton
                    isLoading={isLoading}
                    selectedValues={selectedValues}
                    clearSelectedValues={clearSelectedValues}
                    dimension={dimension}
                    placeholder={placeholder}
                />                 
            </Dropdown>                                 
        </ControlCard>       
    );
};