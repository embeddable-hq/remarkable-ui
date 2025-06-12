// Third Party Libraries
import React, { useEffect } from 'react';

// Local Libraries
import Title from '../Title';
import Description from '../Description';
import CardHeader from '../CardHeader';
import CardContent from '../CardContent';
import styles from './index.module.css';

type ControlCardProps = {
	title?: string;
	description?: string;
	children?: React.ReactNode;
	errorMessage?: string;
};

export default function Card({ title, description, children, errorMessage }: ControlCardProps) {
	return (
		<div className={styles.controlCard}>
			<CardHeader showExportOptions={false}>
				{title && <Title>{title}</Title>}
				{description && <Description>{description}</Description>}
			</CardHeader>
			<CardContent showErrorMessage={!!errorMessage} errorMessage={errorMessage}>
				{children}
			</CardContent>
		</div>
	);
}
