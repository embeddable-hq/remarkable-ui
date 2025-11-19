import styles from './FieldErrorMessage.module.css';

export type FieldErrorMessageProps = {
  message: string;
};

export const FieldErrorMessage = ({ message }: FieldErrorMessageProps) => {
  return <p className={styles.errorMessage}>{message}</p>;
};
