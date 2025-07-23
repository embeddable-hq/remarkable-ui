import React from 'react';
import styles from './Card.module.css';
import { Typography } from '../Typography/Typography';
import { IconButton } from '../IconButton/IconButton';
import { IconDotsVertical, IconLoader2 } from '@tabler/icons-react';
import clsx from 'clsx';

type CardProps = {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  isLoading?: boolean;
};

export const Card: React.FC<CardProps> = ({ children, isLoading }) => {
  return (
    <div className={styles.card}>
      <div className={clsx(styles.cardContent, isLoading && styles.cardContentLoading)}>
        <span className={styles.loadingIcon}>
          <IconLoader2 />
        </span>
        <CardHeader title="Card Title" subtitle="Card Subtitle" />
        {children}
      </div>
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ title, subtitle }) => {
  return (
    <div className={styles.header}>
      <div className={styles.headerTitles}>
        <Typography size="default" height="lg" weight="bold">
          {title}
        </Typography>
        {subtitle && (
          <Typography size="sm" height="md" weight="medium" className={styles.subtitle}>
            {subtitle}
          </Typography>
        )}
      </div>
      {/* TODO: replace with 3 dots component */}
      <IconButton icon={IconDotsVertical} />
    </div>
  );
};
