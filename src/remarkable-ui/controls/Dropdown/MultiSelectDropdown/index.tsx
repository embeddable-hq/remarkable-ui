// Third Party Libraries
import React, { useState, useEffect } from 'react';

// Embeddable Libraries
import { DataResponse, Dimension } from '@embeddable.com/core';

// Local Libraries
import { MultiSelectDropdownProps } from './MultiSelectDropdown.emb';
import ControlCard from '../../../shared/ControlCard'
import Dropdown, { DropdownItem } from '../../../shared/Dropdown';
import DropdownButton from '../../../shared/DropdownButton';
import { CheckboxIcon, CheckboxSelectedIcon } from '../../../constants/icons';

export default ({
    description, 
    dimension,
    onChangeSelectedValues,
    preSelectedValues,
    results,
    setSearchValue,
    title,
}: MultiSelectDropdownProps) => {

    const [selected, setSelected] = useState(() => new Set(preSelectedValues));
    const [localSearchValue, setLocalSearchValue] = useState<string>("");
    const { isLoading, data = [], error } = results; 
    
    useEffect(() => {
        setSelected(new Set(preSelectedValues));
    }, [preSelectedValues]);
    
    // Only call setSearchValue once typing stops.
    useEffect(() => {
        const id = setTimeout(() => setSearchValue(localSearchValue), 500);
        return () => clearTimeout(id);
      }, [localSearchValue, setSearchValue]);

    const toggleValue = (value:string) => {
        setSelected((prev) => {
            const next = new Set(prev); // make a *new* Set (don’t mutate)
            next.has(value) ? next.delete(value) : next.add(value);
            onChangeSelectedValues?.(Array.from(next) as string[]);
            return next;
        });
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

    //Add search input to the top of the dropdown
    dropdownItems.unshift({
        id: `multiselect-dropdown-search`,
        customContent: (<input value={localSearchValue} onChange={(e) => setLocalSearchValue(e.target.value)}/>),
    });

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
            >
                {/* Refactor later to make this a component*/}                
                <DropdownButton isLoading={isLoading}/>                 
            </Dropdown>                                 
        </ControlCard>       
    );
};


/*

TODO:
- pass selected values to Embeddable
- add search to dropdown component generally and pass in prop onSearch
- add all relevant stylings
*/