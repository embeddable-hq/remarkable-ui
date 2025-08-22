import { FC } from 'react';
import styles from './SelectListOptions.module.css';

type SelectListOptionsProps = {
  children: React.ReactNode;
};

export const SelectListOptions: FC<SelectListOptionsProps> = ({ children }) => {
  return <div className={styles.listOptions}>{children}</div>;
};
