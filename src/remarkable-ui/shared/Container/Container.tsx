import React from 'react';
import Card from '../Card';
import CardHeader from '../CardHeader';
import Title from '../Title';
import Description from '../Description';
import CardContent from '../CardContent';
import MessageContainer from '../MessageContainer';
import ChartContainer from '../ChartContainer';

type Props = {
    title?: string;
    description?: string;
    errorMessage?:string;
    loading?: boolean;
    noResults?: boolean;
    children?: React.ReactNode;
}

export default function Container({ title, description, errorMessage, children, loading, noResults }: Props) {

    return (
        <Card>            
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
        </Card>
    );
}