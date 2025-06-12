import React from 'react';
import styles from './index.module.css';

type IconButtonProps = {
	icon: React.ComponentType<{ className?: string }>;
};

export default function IconButton({ icon }: IconButtonProps) {
	const Icon = icon;

	return <button className={styles.iconButton}>{Icon && <Icon className={styles.icon} />}</button>;
}
