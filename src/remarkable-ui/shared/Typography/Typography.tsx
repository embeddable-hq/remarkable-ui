import React from 'react';
import styles from './Typography.module.css';
import clsx from 'clsx';

type TypographyElement = 'p' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'label' | 'div';

type TypographyProps = {
  children: React.ReactNode;
  as?: TypographyElement;
  className?: string;
  title?: string;
  style?: React.CSSProperties;
};

export function Typography({
  children,
  as: Component = 'p',
  className,
  style,
  title,
}: TypographyProps): React.JSX.Element {
  return (
    <Component title={title} className={clsx(styles.typography, className)} style={style}>
      {children}
    </Component>
  );
}
