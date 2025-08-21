import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { TablerIcon } from '@tabler/icons-react';
import { FC } from 'react';
import { Typography } from '../../../../../shared/Typography/Typography';
import styles from './SelectListItem.module.css';

export type SelectListItemProps = {
  value: string;
  label: string;
  startIcon?: TablerIcon;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
};

export const SelectListItem: FC<SelectListItemProps> = ({
  value,
  label,
  startIcon: StartIcon,
  ...props
}) => {
  return (
    <DropdownMenu.Item className={styles.listItem} data-value={value} {...props}>
      {StartIcon && <StartIcon />}
      <Typography>{label}</Typography>
    </DropdownMenu.Item>
  );
};
