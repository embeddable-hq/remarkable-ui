import React from 'react';
import styles from './index.module.css';

type Props = {
	children?: React.ReactNode;
};

export default function Description({ children }: Props) {
	return children && <div className={styles.description}>{children}</div>;
}
