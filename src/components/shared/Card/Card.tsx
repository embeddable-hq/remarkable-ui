import React from 'react';
import styles from './Card.module.css';
import clsx from 'clsx';

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
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
};

export const CardHeader: React.FC<CardHeaderProps> = ({ title, subtitle }) => {
  if (!title && !subtitle) {
    return null;
  }

  return (
    <div className={styles.cardHeader}>
      {title && <h1>{title}</h1>}
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
};

type CardContentProps = {
  children: React.ReactNode;
};

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ children }, ref) => {
    return (
      <div className={styles.cardContent} ref={ref}>
        {children}
      </div>
    );
  },
);

CardContent.displayName = 'CardContent';
