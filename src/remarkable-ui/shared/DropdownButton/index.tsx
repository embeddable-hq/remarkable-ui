import React from 'react';
import styles from './index.module.css'
import Spinner from '../Spinner';

type DropdownButtonProps = {
    isLoading?: boolean;
    isOpen?: boolean;
}

export default function DropdownButton({ isLoading, isOpen }:DropdownButtonProps) {
    return (
        <button className={styles.dropdownButton}>
            {isOpen ? <span>Is open</span> : null}      
            <span>Some text goes here</span>      
            <div>
                { isLoading ? <Spinner/> : "dropdown arrow" }
            </div>             
        </button>
    );
}