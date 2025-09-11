export type ConfirmCancelModalProps = {
  /** Title of the modal */
  title: string;
  /** Message content of the modal */
  message: string;
  /** Label for the confirm button */
  confirmLabel?: string;
  /** Label for the cancel button */
  cancelLabel?: string;
  /** Function to call when confirm button is clicked */
  onConfirm: () => void;
  /** Function to call when cancel button is clicked */
  onCancel?: () => void;
  /** Additional CSS class name */
  className?: string;
};
