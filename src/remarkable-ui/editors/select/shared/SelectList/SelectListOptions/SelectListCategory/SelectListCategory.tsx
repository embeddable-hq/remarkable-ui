import { FC } from 'react';
import styles from './SelectListCategory.module.css';

type SelectListCategoryProps = {
  label: string;
};

export const SelectListCategory: FC<SelectListCategoryProps> = ({ label }) => {
  return (
    <div className={styles.category}>
      <span className={styles.categoryLabel}>{label}</span>
    </div>
  );
};
