import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { FC, ImgHTMLAttributes, SVGProps } from 'react';
import { Typography } from '../../../../../shared/Typography/Typography';
import styles from './SelectListItem.module.css';

export type SelectListItemProps = {
  value?: string;
  label: string;
  startIcon?:
    | React.ReactElement<SVGProps<SVGSVGElement>>
    | React.ReactElement<ImgHTMLAttributes<HTMLImageElement>>;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
};

export const SelectListItem: FC<SelectListItemProps> = ({ value, label, startIcon, ...props }) => {
  return (
    <DropdownMenu.Item className={styles.listItem} data-value={value} {...props}>
      {startIcon}
      <Typography>{label}</Typography>
    </DropdownMenu.Item>
  );
};
