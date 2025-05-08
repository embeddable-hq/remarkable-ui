import React, { useState } from 'react';
import styles from './index.module.css'
import ExportButton from '../ExportButton';
import Spinner from '../Spinner';
import { DataResponse } from '@embeddable.com/core';

type CardHeaderProps = {
    isLoading?: boolean;
    children?: React.ReactNode;
    data?: DataResponse["data"]
}

export default function CardHeader({ isLoading, children, data }:CardHeaderProps) {

    const [localLoading, setLocalLoading] = useState(false);

    const loading = localLoading || isLoading;

    return (
        <div className={styles.header}> 
            <div className={styles.mainContent}>
                {children}
            </div>  
            <div className={styles.rightContent}>
                {loading ? <Spinner/> : <ExportButton data={data} setLocalLoading={ setLocalLoading }/>}               
            </div>
        </div>
    );
}