import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { FC, ImgHTMLAttributes, SVGProps } from 'react';
import styles from './SelectListOption.module.css';
import { Typography } from '../../../../../../shared/Typography/Typography';
import clsx from 'clsx';

export type SelectListOptionProps = {
  value?: string;
  label: string;
  startIcon?:
    | React.ReactElement<SVGProps<SVGSVGElement>>
    | React.ReactElement<ImgHTMLAttributes<HTMLImageElement>>;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
};

export const SelectListOption: FC<SelectListOptionProps> = ({
  value,
  label,
  startIcon,
  disabled,
  ...props
}) => {
  return (
    <DropdownMenu.Item
      className={clsx(styles.listItem, disabled && styles.disabled)}
      data-value={value}
      {...props}
    >
      {startIcon}
      <Typography>{label}</Typography>
    </DropdownMenu.Item>
  );
};
