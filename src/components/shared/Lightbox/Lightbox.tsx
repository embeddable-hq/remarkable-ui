import clsx from 'clsx';
import { FC, ReactNode, useLayoutEffect, useRef } from 'react';
import styles from './Lightbox.module.css';

export type LightboxProps = {
  open: boolean;
  onClose: () => void;
  ariaLabel?: string;
  className?: string;
  children?: ReactNode;
};

/**
 * A modal surface rendered in the browser's top layer via dialog.showModal().
 * Unlike a fixed-position overlay, the top layer escapes transformed or
 * contained ancestors and shadow roots visually, while the node stays in its
 * tree so scoped styles and CSS variables keep applying.
 */
export const Lightbox: FC<LightboxProps> = ({ open, onClose, ariaLabel, className, children }) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const mouseDownOnBackdropRef = useRef(false);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog || typeof dialog.showModal !== 'function') return;

    if (!dialog.open) dialog.showModal();

    // Closing in the cleanup (which runs while the node is still attached)
    // lets the browser restore focus to the previously focused element.
    return () => {
      if (dialog.open) dialog.close();
    };
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return;

    // A modal dialog makes the rest of the page inert, but the page can still
    // scroll underneath it; this deliberately locks the host page's scroll.
    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className={clsx(styles.lightbox, className)}
      aria-label={ariaLabel}
      onClose={onClose}
      onKeyDown={(event) => {
        if (event.key === 'Escape') dialogRef.current?.close();
      }}
      onMouseDown={(event) => {
        // Events on ::backdrop are dispatched to the dialog element itself.
        mouseDownOnBackdropRef.current = event.target === event.currentTarget;
      }}
      onClick={(event) => {
        // Only dismiss when the press started and ended on the backdrop, so a
        // drag from inside the content ending outside does not close it.
        if (mouseDownOnBackdropRef.current && event.target === event.currentTarget) {
          dialogRef.current?.close();
        }
        mouseDownOnBackdropRef.current = false;
      }}
    >
      {children}
    </dialog>
  );
};
