import { Typography } from '../Typography/Typography';
import styles from './FormErrorMessage.module.css';

export type FormErrorMessageProps = {
  message: string;
};

export const FormErrorMessage = ({ message }: FormErrorMessageProps) => {
  return (
    <Typography as="span" className={styles.errorMessage}>
      {message}
    </Typography>
  );
};
