import React from 'react';
import { TypographyProps } from './Typography.types';
import styles from './Typography.module.css';
import clsx from 'clsx';

export function Typography({
  size = 'default',
  weight = 'regular',
  height = 'md',
  children,
  as: Component = 'p',
  className,
}: TypographyProps): React.JSX.Element {
  return (
    <Component
      className={clsx(
        styles.typography,
        styles[`size-${size}`],
        styles[`weight-${weight}`],
        styles[`height-${height}`],
        className,
      )}
    >
      {children}
    </Component>
  );
}
