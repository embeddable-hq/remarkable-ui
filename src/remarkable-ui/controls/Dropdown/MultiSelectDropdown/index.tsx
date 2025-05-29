// Third Party Libraries
import React, { useState, useEffect } from 'react';

// Embeddable Libraries
// import { DataResponse, Dimension } from '@embeddable.com/core';

// Local Libraries
import { MultiSelectDropdownProps } from './MultiSelectDropdown.emb';
import ControlCard from '../../../shared/ControlCard'
import Dropdown, { DropdownItem } from '../../../shared/BaseDropdown';
import MultiSelectDropdownButton from './MultiSelectDropdownButton';
import { CheckboxIcon, CheckboxSelectedIcon } from '../../../constants/icons';
import { useDebouncedEffect } from '../../../hooks/useDebouncedEffect';

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
    
    const toggleValue = (value:string) => {
        setSelected((prev) => {
            const next = new Set(prev); // make a *new* Set (don’t mutate)
            next.has(value) ? next.delete(value) : next.add(value);
            // onChangeSelectedValues?.(Array.from(next) as string[]);
            return next;
        });
    }

    //send the selected values to Embeddable after a delay so we don't send too many requests
    useDebouncedEffect(() => {
        onChangeSelectedValues?.(Array.from(selected) as string[]);
    }, [selected, onChangeSelectedValues], 500);

    const clearSelectedValues = () => {
        setSelected(new Set());
        onChangeSelectedValues?.([]);
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
            >              
                <MultiSelectDropdownButton
                    isLoading={isLoading}
                    selectedValues={Array.from(selected)}
                    clearSelectedValues={clearSelectedValues}
                    dimension={dimension}
                    placeholder={placeholder}
                />                 
            </Dropdown>                                 
        </ControlCard>       
    );
};