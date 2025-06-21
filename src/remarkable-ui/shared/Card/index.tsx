// Third Party Libraries
import React, { useEffect } from 'react';

// Embeddable Libraries
import { DataResponse } from '@embeddable.com/core';

// Local Libraries
import Surface from '../Surface';
import CardHeader from '../CardHeader';
import Title from '../Title';
import Description from '../Description';
import CardContent from '../CardContent';
import ChartContainer from '../ChartContainer';
import { ExportConfig } from '../../shared/ExportButton/useExportItems';

type CardProps = {
	title?: string;
	description?: string;
	errorMessage?: string;
	isLoading?: boolean;
	data?: DataResponse['data'];
	children?: React.ReactNode;
	chartHeader?: React.ReactNode;
	chartFooter?: React.ReactNode;
	exportConfig?: ExportConfig;
	containerRef?: React.RefObject<HTMLDivElement | null>;
};

export default function Card({
	chartFooter,
	chartHeader,
	children,
	containerRef,
	data,
	description,
	errorMessage,
	exportConfig,
	isLoading,
	title,
}: CardProps) {
	return (
		<Surface ref={containerRef}>
			<CardHeader isLoading={isLoading} data={data} exportConfig={exportConfig}>
				{title && <Title>{title}</Title>}
				{description && <Description>{description}</Description>}
			</CardHeader>
			<CardContent
				showSkeletonLoader={isLoading && !data}
				showNoResults={!errorMessage && data?.length === 0}
				showErrorMessage={!!errorMessage}
				errorMessage={errorMessage}
			>
				{chartHeader}
				<ChartContainer>{children}</ChartContainer>
				{chartFooter}
			</CardContent>
		</Surface>
	);
}
