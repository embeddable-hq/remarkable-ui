import React from 'react';
import styles from './Card.module.css';
import { Typography } from '../Typography/Typography';

type CardProps = {
  title: string;
  subtitle?: string;
};
export const Card: React.FC<CardProps> = ({ children }) => {
  return (
    <div className={styles.card}>
      <CardHeader title="Card Title" subtitle="Card Subtitle" />
      {children}
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
      <button>ola</button>
    </div>
  );
};
