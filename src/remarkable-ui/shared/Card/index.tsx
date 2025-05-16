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

type CardProps = {
    title?: string;
    description?: string;
    errorMessage?:string;
    isLoading?: boolean;
    data?: DataResponse["data"]
    children?: React.ReactNode;
    chartHeader?: React.ReactNode;
    chartFooter?: React.ReactNode;
}

export default function Card({ 
    title,
    description,
    errorMessage,
    children,
    isLoading,
    data,
    chartHeader,
    chartFooter
}: CardProps) {

    return (
        <Surface>            
            <CardHeader 
                isLoading={isLoading}
                data={data}
            >
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