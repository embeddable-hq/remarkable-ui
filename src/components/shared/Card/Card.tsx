import React, { CSSProperties } from 'react';
import styles from './Card.module.css';
import { Typography } from '../Typography/Typography';
import clsx from 'clsx';

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
  rightContent?: React.ReactNode;
};

export const CardHeader: React.FC<CardHeaderProps> = ({ title, subtitle, rightContent = null }) => {
  return (
    <div className={styles.header}>
      <div className={styles.headerTitles}>
        <Typography as="h1" size="default" height="lg" weight="bold" className={styles.title}>
          {title}
        </Typography>
        {subtitle && (
          <Typography size="sm" height="md" weight="medium" className={styles.subtitle}>
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
