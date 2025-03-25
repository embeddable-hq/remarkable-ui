import React from 'react';
import styles from './index.module.css'
import ExportButton from '../ExportButton';
import Spinner from '../Spinner';

type Props = {
    loading?: boolean;
    children?: React.ReactNode;
}

export default function CardHeader({ loading = false, children }:Props) {
    return (
        <div className={styles.header}> 
            <div className={styles.content}>
                {children}
            </div>  
            <div>
                {loading ? <Spinner/> : <ExportButton/>}               
            </div>
        </div>
    );
}