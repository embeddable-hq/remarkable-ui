import React, { JSX } from 'react';
import styles from './index.module.css';
import { ErrorIcon } from '../../constants/icons';

type variantType = 'error' | 'noResults';

type MessageContainerProps = {
	variant?: variantType;
	message?: string;
	title?: string;
	className?: string;
};

const svgs: Partial<Record<variantType, (className?: string) => JSX.Element>> = {
	error: (className) => <ErrorIcon className={className || ''} />,
};

export default function MessageContainer({
	variant,
	message,
	title,
	className,
}: MessageContainerProps) {
	const classNames = [styles.message];
	if (variant && styles[variant]) {
		classNames.push(styles[variant]);
	}

	const Icon = variant && svgs[variant];

	return (
		<div className={styles.messageContainer}>
			<div className={classNames.join(' ')}>
				{Icon && Icon(styles.icon)}
				{title && <span className={styles.titleText}>{title}</span>}
				{message && <span className={styles.bodyText}>{message}</span>}
			</div>
		</div>
	);
}
