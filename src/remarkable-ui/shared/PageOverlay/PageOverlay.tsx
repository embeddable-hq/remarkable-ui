import clsx from 'clsx';
import styles from './PageOverlay.module.css';
import type { PageOverlayProps } from './PageOverlay.types';

export const PageOverlay: React.FC<PageOverlayProps> = ({ isVisible, className, children }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div className={clsx(styles.overlay, className)} role="dialog" aria-modal="true">
      {children}
    </div>
  );
};
