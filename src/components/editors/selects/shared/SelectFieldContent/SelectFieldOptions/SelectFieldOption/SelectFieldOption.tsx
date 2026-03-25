import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { ImgHTMLAttributes, SVGProps } from 'react';
import styles from './SelectFieldOption.module.css';
import clsx from 'clsx';

type SelectListOptionIcon =
  | React.ReactElement<SVGProps<SVGSVGElement>>
  | React.ReactElement<ImgHTMLAttributes<HTMLImageElement>>;

export type SelectListOptionProps<T = string> = {
  value?: T;
  isSelected?: boolean;
  label: string;
  rightLabel?: string;
  startIcon?: SelectListOptionIcon;
  endIcon?: SelectListOptionIcon;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
};
export type SelectListOptionPropsWithCategory<T = string> = SelectListOptionProps<T> & {
  category: string;
};

export const SelectListOption = <T,>({
  value,
  isSelected,
  label,
  rightLabel,
  startIcon,
  endIcon,
  disabled,
  ...props
}: SelectListOptionProps<T>) => {
  return (
    <DropdownMenu.Item
      className={clsx(
        styles.selectFieldOption,
        disabled && styles.disabled,
        isSelected && styles.selected,
      )}
      data-value={String(value)}
      {...props}
    >
      <span className={styles.leftContent}>
        {startIcon}
        <span title={label}>{label}</span>
      </span>
      <span className={styles.rightContent}>
        <span title={rightLabel}>{rightLabel}</span>
        {endIcon}
      </span>
    </DropdownMenu.Item>
  );
};
