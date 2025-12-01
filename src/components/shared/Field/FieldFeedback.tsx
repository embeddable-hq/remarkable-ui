import clsx from 'clsx';
import styles from './FieldFeedback.module.css';
import { FC } from 'react';

export type FieldFeedbackProps = {
  message: string;
  variant?: 'error';
  className?: string;
};

export const FieldFeedback: FC<FieldFeedbackProps> = ({ message, variant, className }) => {
  return (
    <p className={clsx(styles.fieldFeedback, variant && styles[variant], className)}>{message}</p>
  );
};
