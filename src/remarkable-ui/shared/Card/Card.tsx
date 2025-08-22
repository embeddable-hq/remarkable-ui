import React from 'react';
import styles from './Card.module.css';
import clsx from 'clsx';
import { Typography } from '../Typography/Typography';

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div className={clsx(styles.card, className)} ref={ref} {...props}>
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';

type CardHeaderProps = {
  title?: string;
  subtitle?: string;
  rightContent?: React.ReactNode;
};

export const CardHeader: React.FC<CardHeaderProps> = ({ title, subtitle, rightContent }) => {
  return (
    <div className={styles.header}>
      <div className={styles.titles}>
        <Typography as="h1" className={styles.title}>
          {title}
        </Typography>
        {subtitle && (
          <Typography as="p" className={styles.subtitle}>
            {subtitle}
          </Typography>
        )}
      </div>
      {rightContent}
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
