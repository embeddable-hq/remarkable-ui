import React, { CSSProperties } from 'react';
import styles from './Card.module.css';
import { Typography } from '../Typography/Typography';
import { IconLoader2 } from '@tabler/icons-react';
import clsx from 'clsx';

type CardProps = {
  children: React.ReactNode;
  isLoading?: boolean;
  style?: CSSProperties;
};

export const Card: React.FC<CardProps> = ({ children, isLoading, ...props }) => {
  return (
    <div className={clsx(styles.card)} {...props}>
      <div className={clsx(styles.loadingIcon, isLoading && styles.loadingIconVisible)}>
        <IconLoader2 />
      </div>
      {children}
    </div>
  );
};

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
export const CardContent: React.FC<CardContentProps> = ({ children }) => {
  return <div className={styles.content}>{children}</div>;
};
