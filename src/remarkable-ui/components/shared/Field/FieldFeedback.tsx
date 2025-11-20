import clsx from 'clsx';
import styles from './FieldFeedback.module.css';

export type FieldFeedbackProps = {
  message: string;
  variant?: 'error';
  className?: string;
};

export const FieldFeedback = ({ message, variant, className }: FieldFeedbackProps) => {
  return (
    <p className={clsx(styles.fieldFeedback, variant && styles[variant], className)}>{message}</p>
  );
};
