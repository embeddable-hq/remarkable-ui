import React from 'react';
import styles from './index.module.css';

type Props = {
    children?: React.ReactNode;
}

export default function Surface({ children }: Props) {

    return (
        <div className={styles.surface}>
            {children}
        </div>
    );
}