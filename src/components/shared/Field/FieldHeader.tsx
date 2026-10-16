import clsx from 'clsx';
import styles from './FieldHeader.module.css';

export type FieldHeaderProps = {
  className?: string;
  label?: string;
  required?: boolean;
  requiredLabel?: string;
};

type FieldHeaderInternalProps = FieldHeaderProps & {
  id?: string;
  // Keeps the required marker out of the accessible name when the control already
  // exposes it via aria-required, so it isn't announced twice.
  requiredAriaHidden?: boolean;
};

export const FieldHeader = ({
  label,
  required,
  requiredLabel = 'Required',
  className,
  id,
  requiredAriaHidden,
}: FieldHeaderInternalProps) => {
  if (!label && !required) {
    return null;
  }

  return (
    <label id={id} className={clsx(styles.fieldHeader, className)}>
      {label}
      {required && <span aria-hidden={requiredAriaHidden || undefined}>{requiredLabel}</span>}
    </label>
  );
};
