import React from 'react';
import styles from './index.module.css';

type Props = {
	children?: React.ReactNode;
	ref?: React.RefObject<HTMLDivElement | null>;
};

export default function Surface({ children, ref }: Props) {
	return (
		<div className={styles.surface} ref={ref}>
			{children}
		</div>
	);
}
