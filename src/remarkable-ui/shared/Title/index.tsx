import React from 'react';
import styles from './index.module.css'

type Props = {
    children?: React.ReactNode;
}

export default function Title({children}:Props) {
    return (children && (
        <div className={styles.title}> 
            {children}              
        </div>
    ));
}