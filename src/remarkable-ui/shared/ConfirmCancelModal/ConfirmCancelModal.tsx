import React, { useEffect, useCallback } from 'react';
import { Card, CardHeader, CardContent } from '../Card/Card';
import { Button } from '../Button/Button';
import { Typography } from '../Typography/Typography';
import styles from './ConfirmCancelModal.module.css';
import type { ConfirmCancelModalProps } from './ConfirmCancelModal.types';
import { PageOverlay } from '../PageOverlay';
import { IconX } from '@tabler/icons-react';
import { IconButton } from '../IconButton/IconButton';
import clsx from 'clsx';

export const ConfirmCancelModal: React.FC<ConfirmCancelModalProps> = ({
  isOpen,
  onClose,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  className,
}) => {
  // Handle confirm button click
  const handleConfirm = useCallback(() => {
    onConfirm();
    onClose();
  }, [onConfirm, onClose]);

  // Handle cancel button click
  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  }, [onCancel, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <PageOverlay>
      <Card className={clsx(styles.modal, className)}>
        <CardHeader title={title} rightContent={<IconButton icon={IconX} onClick={onClose} />} />
        <CardContent>
          <Typography as="span">{message}</Typography>
          <div className={styles.actions}>
            <Button variant="secondary" size="medium" onClick={handleCancel}>
              {cancelLabel}
            </Button>
            <Button variant="primary" size="medium" onClick={handleConfirm}>
              {confirmLabel}
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageOverlay>
  );
};
