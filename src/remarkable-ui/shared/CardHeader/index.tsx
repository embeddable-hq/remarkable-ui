import React, { useState } from 'react';
import styles from './index.module.css'
import ExportButton from '../ExportButton';
import Spinner from '../Spinner';

type Props = {
    isLoading?: boolean;
    children?: React.ReactNode;
}

export default function CardHeader({ isLoading, children }:Props) {

    const [localLoading, setLocalLoading] = useState(false);

    const loading = localLoading || isLoading;

    return (
        <div className={styles.header}> 
            <div className={styles.content}>
                {children}
            </div>  
            <div>
                {loading ? <Spinner/> : <ExportButton setLocalLoading={ setLocalLoading }/>}               
            </div>
        </div>
    );
}