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

// showModal() supports stacked modal dialogs, so the body scroll lock is
// reference-counted across instances: the original overflow value is restored
// only when the last open Lightbox releases it.
let scrollLockCount = 0;
let previousBodyOverflow = '';

const lockBodyScroll = () => {
  if (scrollLockCount === 0) {
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  }
  scrollLockCount += 1;
};

const unlockBodyScroll = () => {
  scrollLockCount = Math.max(0, scrollLockCount - 1);
  if (scrollLockCount === 0) {
    document.body.style.overflow = previousBodyOverflow;
  }
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
  const suppressNextCloseRef = useRef(false);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (!open || !dialog || typeof dialog.showModal !== 'function') return;

    if (!dialog.open) dialog.showModal();

    // Closing in the cleanup (which runs while the node is still attached)
    // lets the browser restore focus to the previously focused element. This
    // close is a lifecycle detail (Strict Mode replay, controlled open=false,
    // unmount), not a user dismissal, so its close event must not reach
    // onClose.
    return () => {
      if (dialog.open) {
        suppressNextCloseRef.current = true;
        dialog.close();
      }
    };
  }, [open]);

  useLayoutEffect(() => {
    if (!open) return;

    // A modal dialog makes the rest of the page inert, but the page can still
    // scroll underneath it; this deliberately locks the host page's scroll.
    lockBodyScroll();
    return () => unlockBodyScroll();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      className={clsx(styles.lightbox, className)}
      aria-label={ariaLabel}
      onClose={() => {
        if (suppressNextCloseRef.current) {
          suppressNextCloseRef.current = false;
          return;
        }
        onClose();
      }}
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
