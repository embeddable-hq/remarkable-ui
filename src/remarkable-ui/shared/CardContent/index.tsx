import React from 'react';
import styles from './index.module.css';
import SkeletonLoader from '../SkeletonLoader';
import MessageContainer from '../MessageContainer';

type Props = {
    children?: React.ReactNode;
    showSkeletonLoader?: boolean;
}

export default function CardContent({ showSkeletonLoader = false, children }: Props) {

    return (
        <div className={styles.content}>
            {showSkeletonLoader 
                ? <SkeletonLoader/> 
                : children 
            }
        </div>
    );
}