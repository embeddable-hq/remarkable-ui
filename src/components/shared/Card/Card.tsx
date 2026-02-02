import React from 'react';
import styles from './Card.module.css';
import clsx from 'clsx';
import { IconInfoCircle } from '@tabler/icons-react';
import { Tooltip } from '../Tooltip/Tooltip';

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
  tooltip?: React.ReactNode;
};

export const CardHeader: React.FC<CardHeaderProps> = ({ title, subtitle, tooltip }) => {
  if (!title && !subtitle && !tooltip) {
    return null;
  }

  return (
    <div className={styles.cardHeader}>
      <div className={styles.cardHeaderTitle}>
        {tooltip && (
          <Tooltip side="top" align="center" trigger={<IconInfoCircle />}>
            {tooltip}
          </Tooltip>
        )}
        {title && <h1>{title}</h1>}
      </div>
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
