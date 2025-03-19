import React from 'react';
import { styled }  from 'styled-components';

type Props = {
    title?: string;
    description?: string;
  };

const HeaderContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    flex: 1 0 0;
    width: 100%;
`;

const Title = styled.div`
    width: 100%;
    color: #212129;
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: 19px;
`;

const Description = styled.div`
    width: 100%;
    color: #5C5C66;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 16px;
`;

export default function Header({ title, description }: Props) {
    return (
        <HeaderContainer>
            {title && <Title>{title}</Title>}
            {description && <Description>{description}</Description>}
        </HeaderContainer>
    );
}