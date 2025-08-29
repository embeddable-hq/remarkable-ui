import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { FC, ImgHTMLAttributes, SVGProps } from 'react';
import styles from './SelectListOption.module.css';
import { Typography } from '../../../../../../shared/Typography/Typography';
import clsx from 'clsx';

type SelectListOptionIcon =
  | React.ReactElement<SVGProps<SVGSVGElement>>
  | React.ReactElement<ImgHTMLAttributes<HTMLImageElement>>;

export type SelectListOptionProps = {
  value?: string;
  label: string;
  rightLabel?: string;
  startIcon?: SelectListOptionIcon;
  endIcon?: SelectListOptionIcon;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
};

export const SelectListOption: FC<SelectListOptionProps> = ({
  value,
  label,
  rightLabel,
  startIcon,
  endIcon,
  disabled,
  ...props
}) => {
  return (
    <DropdownMenu.Item
      className={clsx(styles.listItem, disabled && styles.disabled)}
      data-value={value}
      {...props}
    >
      <span className={styles.startContent}>
        {startIcon}
        <Typography>{label}</Typography>
      </span>
      <span className={styles.endContent}>
        <Typography>{rightLabel}</Typography>
        {endIcon}
      </span>
    </DropdownMenu.Item>
  );
};
