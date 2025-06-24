import React from 'react';
import styles from './index.module.css';

type IconButtonProps = {
	icon: React.ComponentType<{ className?: string }>;
};

export default function IconButton({ icon }: IconButtonProps) {
	const Icon = icon;

	return (
		<button
			data-png-export-ignore // This is used to hide the icon when exporting to PNG
			className={styles.iconButton}
		>
			{Icon && <Icon className={styles.icon} />}
		</button>
	);
}
