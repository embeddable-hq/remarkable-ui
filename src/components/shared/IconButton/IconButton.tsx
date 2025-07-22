import clsx from 'clsx';
import React from 'react';
import styles from './IconButton.module.css';
import { TablerIcon } from '@tabler/icons-react';

type IconButtonProps = {
  className?: string;
  disabled?: boolean;
  icon: TablerIcon;
  onClick?: () => void;
};

export const IconButton: React.FC<IconButtonProps> = ({
  icon: Icon,
  className,
  disabled,
  onClick,
}) => {
  return (
    <button onClick={onClick} disabled={disabled} className={clsx(styles.iconButton, className)}>
      <Icon className={styles.icon} />
    </button>
  );
};
