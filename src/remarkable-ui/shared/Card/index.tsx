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
    loading?: boolean;
    noResults?: boolean;
    children?: React.ReactNode;
}

export default function Card({ title, description, errorMessage, children, loading, noResults }: CardProps) {

    useEffect(() => {
        loadRootVariables();
    }, []);

    return (
        <Surface>            
            <CardHeader 
                loading={loading}
            >
                <Title>{title}</Title>
                <Description>{description}</Description>
            </CardHeader>
            <CardContent
                loading={loading}
            >
                {errorMessage 
                    ? (
                        <MessageContainer
                            variant={"error"}
                            title="Something went wrong"
                            message={errorMessage} 
                        />
                    ) : noResults ? (
                        <MessageContainer
                            title="No results" 
                        />
                    ) : (
                        <ChartContainer>
                            {children}
                        </ChartContainer>
                    )}
            </CardContent>
        </Surface>
    );
}