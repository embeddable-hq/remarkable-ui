import React, { useRef } from 'react';
import styles from './index.module.css';

type ButtonProps = {
	children: React.ReactNode;
	disabled?: boolean;
	fullWidth?: boolean;
	handleButtonKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
	Icon?: React.ComponentType<{ className?: string }>;
	onClick: () => void;
};

export default function PrimaryButton({
	children,
	disabled = false,
	fullWidth = false,
	handleButtonKeyDown,
	Icon,
	onClick,
}: ButtonProps) {
	const buttonRef = useRef<HTMLButtonElement>(null);

	return (
		<button
			ref={buttonRef}
			className={`${styles.btn} ${fullWidth ? styles.fullWidth : ''}`}
			onClick={onClick}
			type="button"
			disabled={disabled}
			onKeyDown={handleButtonKeyDown}
		>
			{Icon && <Icon className={styles.icon} />}
			<span className={styles.buttonText}>{children}</span>
		</button>
	);
}
