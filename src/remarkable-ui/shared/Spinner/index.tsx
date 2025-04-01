import React from 'react';
import styles from './index.module.css'
import { SpinnerIcon } from '../../constants/icons';

type Props = {
    children?: React.ReactNode;
}

export default function Spinner() {
    return (
        <SpinnerIcon className={styles.spinner} />
    );
}