import { FC } from 'react';
import styles from './SelectFieldCategory.module.css';

type SelectFieldCategoryProps = {
  label: string;
};

export const SelectFieldCategory: FC<SelectFieldCategoryProps> = ({ label }) => {
  return <span className={styles.selectFieldCategory}>{label}</span>;
};
