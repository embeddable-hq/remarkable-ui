import React, { CSSProperties } from 'react';
import styles from './Card.module.css';
import clsx from 'clsx';
import { Typography } from '../Typography/Typography';

type CardProps = {
  children: React.ReactNode;
  style?: CSSProperties;
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(({ children, ...props }, ref) => {
  return (
    <div className={clsx(styles.card)} ref={ref} {...props}>
      {children}
    </div>
  );
});

Card.displayName = 'Card';

type CardHeaderProps = {
  title: string;
  subtitle?: string;
};

export const CardHeader: React.FC<CardHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className={styles.header}>
      <Typography as="h1" className={styles.title}>
        {title}
      </Typography>
      {subtitle && (
        <Typography as="p" className={styles.subtitle}>
          {subtitle}
        </Typography>
      )}
    </div>
  );
};

type CardContentProps = {
  children: React.ReactNode;
};

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ children }, ref) => {
    return (
      <div className={styles.content} ref={ref}>
        {children}
      </div>
    );
  },
);

CardContent.displayName = 'CardContent';
