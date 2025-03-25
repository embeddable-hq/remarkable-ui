import React, { JSX } from 'react';
import styles from './index.module.css'
import { ErrorIcon } from '../../constants/icons'

type IconVariant = 'error';

type Props = {
    variant?: IconVariant
    message?: string;
    title?: string;
    className?: string;
}

const icon = (variant: IconVariant, className?: string) => {
    const svgs: Record<IconVariant, (className?: string) => JSX.Element> = {
        error: (className) => <ErrorIcon className={className} />,
    };

    const renderIcon = svgs[variant];
    return renderIcon ? renderIcon(className) : null;
};

export default function MessageContainer({variant, message, title, className}: Props) {

    return (
        <div className={styles.messageContainer}> 
            <div
                className={styles.message}
                style={{ color: variant === 'error' ? '#D03109' : 'inherit'}}
            >
                {icon('error', className)}            
                {title && (<span className={styles.titleText}>{title}</span>)}
                {message && (<span className={styles.bodyText}>{message}</span>)}
            </div>              
        </div>
    );
}