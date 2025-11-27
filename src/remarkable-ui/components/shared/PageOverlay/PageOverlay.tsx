import clsx from 'clsx';
import styles from './PageOverlay.module.css';
import type { PageOverlayProps } from './PageOverlay.types';

export const PageOverlay: React.FC<PageOverlayProps> = ({ className, children }) => {
  return <div className={clsx(styles.overlay, className)}>{children}</div>;
};
