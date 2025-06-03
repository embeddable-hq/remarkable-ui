// Third Party Libraries
import React, { useEffect, useRef, useState } from 'react';

//Local Libraries
import styles from './index.module.css'
import { SearchIcon, CloseIcon } from '../../constants/icons';

type SearchBar = {
    onSearch: (value:string) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
}

export default function SearchBar({ onSearch, onKeyDown }:SearchBar) {

    const [searchValue, setSearchValue] = useState('');

    const inputRef = useRef<HTMLInputElement>(null);
    
    useEffect(() => {
        inputRef.current?.focus();
    }, []);
    
    //call onSearch on a timer so it triggers once the user stops typing  
    useEffect(() => {
        const delay = searchValue.length > 0 ? 500 : 0;
        const id = setTimeout(() => onSearch(searchValue), delay);
        return () => clearTimeout(id);
    }, [searchValue, setSearchValue]);

    return (
        <div className={styles.searchInputContainer}>
            <div className={`${styles.searchInput} ${searchValue.length > 0 ? styles.searchInputActive : ''}`}>
                <SearchIcon />
                <input
                    ref={inputRef}
                    autoFocus
                    placeholder="Search..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)} 
                    onKeyDown={onKeyDown}              
                /> 
                <div onClick={() => setSearchValue("")} className={styles.closeIconContainer}>
                    {searchValue.length > 0 && (
                        <CloseIcon />
                    )}
                </div>         
            </div>  
        </div>    
    );
}