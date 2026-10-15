import clsx from 'clsx';
import styles from './FieldHeader.module.css';

export type FieldHeaderProps = {
  className?: string;
  label?: string;
  required?: boolean;
  requiredLabel?: string;
};

type FieldHeaderInternalProps = FieldHeaderProps & { id?: string };

export const FieldHeader = ({
  label,
  required,
  requiredLabel = 'Required',
  className,
  id,
}: FieldHeaderInternalProps) => {
  if (!label && !required) {
    return null;
  }

  return (
    <label id={id} className={clsx(styles.fieldHeader, className)}>
      {label}
      {required && <span>{requiredLabel}</span>}
    </label>
  );
};
