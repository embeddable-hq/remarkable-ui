import React from 'react';
import { styled }  from 'styled-components';
import Header from './Header';

type Props = {
    title?: string;
    description?: string;
    children?: React.ReactNode;
}

// Define a styled card container
const CardContainer = styled.div`
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    display: flex;
    padding: 32px;
    flex-direction: column;
    align-items: center;
    gap: 32px;
    border-radius: 32px;
    background: #F9F9FA;
`;

export default function Card({ title, description, children }: Props) {
    return (
        <CardContainer>
            <Header title={title} description={description}/>
            {children}
        </CardContainer>
    );
}