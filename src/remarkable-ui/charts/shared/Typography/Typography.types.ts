import React from 'react';

export type TypographySize = '4xl' | 'xl' | 'default' | 'sm' | 'xs';
export type TypographyWeight = 'regular' | 'medium' | 'bold';
export type TypographyHeight = 'xl' | 'lg' | 'md' | 'sm';

export type TypographyProps = {
  size?: TypographySize;
  weight?: TypographyWeight;
  height?: TypographyHeight;
  children: React.ReactNode;
  as?: keyof React.JSX.IntrinsicElements;
  className?: string;
};
