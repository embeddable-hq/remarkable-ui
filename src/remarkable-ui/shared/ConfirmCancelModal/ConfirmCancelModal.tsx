import React from 'react';
import { Card, CardHeader, CardContent } from '../Card/Card';
import { Button } from '../Button/Button';
import { Typography } from '../Typography/Typography';
import styles from './ConfirmCancelModal.module.css';
import type { ConfirmCancelModalProps } from './ConfirmCancelModal.types';
import { PageOverlay } from '../PageOverlay';
import { IconX } from '@tabler/icons-react';
import { IconButton } from '../IconButton/IconButton';

export const ConfirmCancelModal: React.FC<ConfirmCancelModalProps> = ({
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  className,
}) => {
  return (
    <PageOverlay>
      <Card className={className}>
        <CardHeader title={title} rightContent={<IconButton icon={IconX} onClick={onCancel} />} />
        <CardContent>
          <Typography as="span">{message}</Typography>
          <div className={styles.actions}>
            <Button variant="secondary" size="medium" onClick={onCancel}>
              {cancelLabel}
            </Button>
            <Button variant="primary" size="medium" onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </div>
        </CardContent>
      </Card>
    </PageOverlay>
  );
};
