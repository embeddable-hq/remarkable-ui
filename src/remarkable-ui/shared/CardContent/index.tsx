import React from 'react';
import styles from './index.module.css';
import SkeletonLoader from '../SkeletonLoader';
import MessageContainer from '../MessageContainer';

type Props = {
    children?: React.ReactNode;
    errorMessage?: string;
    loading?: boolean;
}

export default function CardContent({ loading = false, errorMessage, children }: Props) {

    return (
        <div className={styles.content}>
            {loading 
                ? <SkeletonLoader/> 
                : children 
            }
        </div>
    );
}