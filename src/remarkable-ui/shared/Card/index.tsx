import React, { useEffect } from 'react';
import Surface from '../Surface';
import CardHeader from '../CardHeader';
import Title from '../Title';
import Description from '../Description';
import CardContent from '../CardContent';
import MessageContainer from '../MessageContainer';
import ChartContainer from '../ChartContainer';
import { loadRootVariables } from '../../utils/tempLoadVars'

type CardProps = {
    title?: string;
    description?: string;
    errorMessage?:string;
    isLoading?: boolean;
    data?: { [attr: string]: any; }[];
    children?: React.ReactNode;
}

export default function Card({ title, description, errorMessage, children, isLoading, data }: CardProps) {

    useEffect(() => {
        loadRootVariables();
    }, []);

    return (
        <Surface>            
            <CardHeader 
                isLoading={isLoading}
            >
                <Title>{title}</Title>
                <Description>{description}</Description>
            </CardHeader>
            <CardContent
                showSkeletonLoader={isLoading && !data}
                showNoResults={!errorMessage && data?.length === 0}
                showErrorMessage={!!errorMessage}    
                errorMessage={errorMessage}            
            >
                <ChartContainer>
                    {children}
                </ChartContainer>
            </CardContent>
        </Surface>
    );
}