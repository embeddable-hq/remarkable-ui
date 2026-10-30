import { createContext } from 'react';

type CardContextValue = {
  titleId?: string;
};

export const CardContext = createContext<CardContextValue>({});
