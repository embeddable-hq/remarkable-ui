import React, { JSX } from 'react';
import styles from './index.module.css'
import { errorIcon } from '../../constants/icons'

type IconVariant = 'error';

type Props = {
    variant?: IconVariant
    message?: string;
    title?: string;
}

const svgs: Record<IconVariant, JSX.Element> = {
    error: errorIcon
}

const icon = (variant:IconVariant) => {
    return svgs[variant];
  };

export default function MessageContainer({variant, message, title}: Props) {
    return (
        <div className={styles.messageContainer}> 
            <div
                className={styles.message}
                style={{ color: variant === 'error' ? '#D03109' : 'inherit'}}
            >
                {variant && (<span>{icon(variant)}</span>)}            
                {title && (<span className={styles.titleText}>{title}</span>)}
                {message && (<span className={styles.bodyText}>{message}</span>)}
            </div>              
        </div>
    );
}