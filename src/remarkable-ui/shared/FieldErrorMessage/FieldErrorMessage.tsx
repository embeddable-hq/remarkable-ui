import { Typography } from '../Typography/Typography';
import styles from './FieldErrorMessage.module.css';

export type FieldErrorMessageProps = {
  message: string;
};

export const FieldErrorMessage = ({ message }: FieldErrorMessageProps) => {
  return (
    <Typography as="span" className={styles.errorMessage}>
      {message}
    </Typography>
  );
};
