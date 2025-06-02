import React from 'react';
import styles from './index.module.css';
import SkeletonLoader from '../SkeletonLoader';
import MessageContainer from '../MessageContainer';

type CardContentProps = {
    children?: React.ReactNode;
    showSkeletonLoader?: boolean;
    showErrorMessage?: boolean;
    showNoResults?: boolean;
    errorMessage?: string;
}

export default function CardContent({ showSkeletonLoader = false, showErrorMessage, showNoResults, errorMessage, children }: CardContentProps) {

    let content;

    if (showSkeletonLoader) {
        content = <SkeletonLoader />;
    } else if (showErrorMessage) {
        content = (
            <MessageContainer
                variant={"error"}
                title="Something went wrong"
                message={errorMessage} 
            /> 
        )
    } else if (showNoResults) {
        content = (
            <MessageContainer
                variant={"noResults"}
                title="No results" 
            />
        )
    } else {
        content = children
    }

    return (
        <div className={styles.content}>                        
            {content}           
        </div>
    );
}