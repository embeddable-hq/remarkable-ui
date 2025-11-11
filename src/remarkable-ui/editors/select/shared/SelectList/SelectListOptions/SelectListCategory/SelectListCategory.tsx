import { FC } from 'react';
import clsx from 'clsx';
import styles from './SelectListCategory.module.css';

type SelectListCategoryProps = {
  label: string;
  sticky?: boolean;
};

export const SelectListCategory: FC<SelectListCategoryProps> = ({ label, sticky = false }) => {
  return (
    <div className={clsx(styles.category, sticky && styles.sticky)}>
      <span className={styles.categoryLabel}>{label}</span>
    </div>
  );
};
