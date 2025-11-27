import clsx from 'clsx';
import styles from './PageOverlay.module.css';
import { FC, ReactNode } from 'react';

export type PageOverlayProps = {
  className?: string;
  children?: ReactNode;
};

export const PageOverlay: FC<PageOverlayProps> = ({ className, children }) => {
  return <div className={clsx(styles.overlay, className)}>{children}</div>;
};
