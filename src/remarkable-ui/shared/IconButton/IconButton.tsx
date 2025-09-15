import clsx from 'clsx';
import React from 'react';
import styles from './IconButton.module.css';
import { TablerIcon } from '@tabler/icons-react';
import { BaseButton, type BaseButtonProps } from '../BaseButton';

type IconButtonProps = Omit<BaseButtonProps, 'variant'> & {
  className?: string;
  icon: TablerIcon;
};

export const IconButton: React.FC<IconButtonProps> = ({ icon: Icon, className, ...props }) => {
  return (
    <BaseButton variant="secondary" className={clsx(styles.iconButton, className)} {...props}>
      <Icon className={styles.icon} />
    </BaseButton>
  );
};
