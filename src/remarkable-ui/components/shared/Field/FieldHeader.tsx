import clsx from 'clsx';
import styles from './FieldHeader.module.css';

export type FieldHeaderProps = {
  className?: string;
  label?: string;
  required?: boolean;
  requiredLabel?: string;
};

export const FieldHeader = ({
  label,
  required,
  requiredLabel = 'Required',
  className,
}: FieldHeaderProps) => {
  if (!label && !required) {
    return null;
  }

  return (
    <label className={clsx(styles.fieldHeader, className)}>
      {label}
      {required && <span>{requiredLabel}</span>}
    </label>
  );
};
