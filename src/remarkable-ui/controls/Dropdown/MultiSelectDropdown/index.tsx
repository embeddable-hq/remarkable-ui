// Third Party Libraries
import React, { useState, useEffect } from 'react';

// Embeddable Libraries
import { DataResponse, Dimension } from '@embeddable.com/core';

// Local Libraries
import { MultiSelectDropdownProps } from './MultiSelectDropdown.emb';
import ControlCard from '../../../shared/ControlCard'
import Dropdown, { DropdownItem } from '../../../shared/Dropdown';
import DropdownButton from '../../../shared/DropdownButton';

export default ({
    title,
    description, 
    dimension,
    results,
    setSearchValue,
}: MultiSelectDropdownProps) => {

    const [selected, setSelected] = useState(() => new Set());
    const [localSearchValue, setLocalSearchValue] = useState<string>("");
    const { isLoading, data = [], error } = results;
    
    // Only call setSearchValue after typing stops.
    useEffect(() => {
        const id = setTimeout(() => setSearchValue(localSearchValue), 500);
        return () => clearTimeout(id);
      }, [localSearchValue, setSearchValue]);

    const toggleValue = (value:string) =>
        setSelected((prev) => {
            const next = new Set(prev); // make a *new* Set (don’t mutate)
            next.has(value) ? next.delete(value) : next.add(value);
            return next;
        });
    
    const buildDropdownItem = (value: string, index:number):DropdownItem => {
        return {
            id: `multiselect-dropdown-${value}-${index}`,
            label: `${value} ${selected.has(value) ? "checked" : "not checked"}`,
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

If a user selects all, set the mode to 'none'. 
If a user deselects all, set the mode to 'include'
If the previous mode was 'none', and a user deselects an item, set the mode to 'exclude'









*/