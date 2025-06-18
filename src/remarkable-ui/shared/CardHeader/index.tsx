import React, { useState, Children } from 'react';
import styles from './index.module.css';
import ExportButton from '../ExportButton';
import Spinner from '../Spinner';
import { DataResponse } from '@embeddable.com/core';
import { ExportConfig } from '../ExportButton/useExportItems';

type CardHeaderProps = {
	isLoading?: boolean;
	children?: React.ReactNode;
	data?: DataResponse['data'];
	showExportOptions?: boolean; //TODO: temp.
	exportConfig?: ExportConfig;
};

export default function CardHeader({
	children,
	data,
	exportConfig,
	isLoading,
	showExportOptions = true,
}: CardHeaderProps) {
	const [localLoading, setLocalLoading] = useState(false);

	const loading = localLoading || isLoading;

	//if there are no children, loading requirement, or export options, return nothing.
	if (
		(!children || Children.toArray(children).every((item) => item === null)) &&
		isLoading === undefined &&
		!showExportOptions
	)
		return null;

	return (
		<div className={styles.header}>
			<div className={styles.mainContent}>{children}</div>
			<div className={styles.rightContent}>
				{loading ? (
					<Spinner />
				) : (
					showExportOptions && (
						<ExportButton exportConfig={exportConfig} setLocalLoading={setLocalLoading} />
					)
				)}
			</div>
		</div>
	);
}
