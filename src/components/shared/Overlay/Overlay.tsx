import clsx from 'clsx';
import styles from './Overlay.module.css';
import { FC, ReactNode } from 'react';

type OverlayProps = {
  className?: string;
  children?: ReactNode;
};

export const Overlay: FC<OverlayProps> = ({ className, children }) => {
  return <div className={clsx(styles.overlay, className)}>{children}</div>;
};
