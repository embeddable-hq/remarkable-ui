// Third Party Libraries
import React, { useEffect, useRef, useState } from 'react';

//Local Libraries
import styles from './index.module.css'
import { SearchIcon, CloseIcon } from '../../constants/icons';

type DropdownSearch = {
    onSearch: (value:string) => void;
    // onSetSearchValue: (value:string) => void;
    // searchValue: string;
}

export default function DropdownSearch({ onSearch }:DropdownSearch) {

    const [searchValue, setSearchValue] = useState('');

    const inputRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
        inputRef.current?.focus();
    }, []);
    
    //call onSearch on a timer so it triggers once the user stops typing  
    useEffect(() => {
        if (searchValue.length === 0) {
            onSearch("");
            return;
        }
        const id = setTimeout(() => onSearch(searchValue), 500);
        return () => clearTimeout(id);
    }, [searchValue, setSearchValue]);

    return (
        <div className={`${styles.searchInput} ${searchValue.length > 0 ? styles.searchInputActive : ''}`}>
            <SearchIcon />
            <input
                ref={inputRef}
                autoFocus
                placeholder="Search..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}                
            /> 
            <div onClick={() => setSearchValue("")} className={styles.closeIconContainer}>
                {searchValue.length > 0 && (
                    <CloseIcon />
                )}
            </div>         
        </div>      
    );
}