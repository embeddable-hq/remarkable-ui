import React from 'react';
import styles from './index.module.css';

type Props = {
	children?: React.ReactNode;
	containerRef?: React.RefObject<HTMLDivElement | null>;
};

export default function Surface({ children, containerRef }: Props) {
	return (
		<div className={styles.surface} ref={containerRef}>
			{children}
		</div>
	);
}
