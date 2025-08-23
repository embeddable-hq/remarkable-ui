import { FC } from 'react';
import styles from './SelectListOptions.module.css';
import clsx from 'clsx';

export type SelectListOptionsProps = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
  disabled?: boolean;
};

export const SelectListOptions: FC<SelectListOptionsProps> = ({ children, disabled, ...props }) => {
  return (
    <div className={clsx(styles.listOptions, disabled && styles.disabled)} {...props}>
      {children}
    </div>
  );
};
