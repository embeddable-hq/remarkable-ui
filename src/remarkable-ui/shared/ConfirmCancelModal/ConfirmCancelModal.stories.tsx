import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';
import { Button } from '../Button/Button';
import { ConfirmCancelModal } from './ConfirmCancelModal';

const meta = {
  component: ConfirmCancelModal,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    title: {
      control: 'text',
    },
    message: {
      control: 'text',
    },
    confirmLabel: {
      control: 'text',
    },
    cancelLabel: {
      control: 'text',
    },
  },
} satisfies Meta<typeof ConfirmCancelModal>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper component to demonstrate modal state management
const ConfirmCancelModalDemo = (args: React.ComponentProps<typeof ConfirmCancelModal>) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="primary" size="medium" onClick={() => setIsOpen(true)}>
        Open Confirm Modal
      </Button>
      {isOpen && (
        <ConfirmCancelModal
          {...args}
          onConfirm={() => {
            args.onConfirm();
            setIsOpen(false);
          }}
          onCancel={() => {
            args.onCancel?.();
            setIsOpen(false);
          }}
        />
      )}
    </>
  );
};

export const Default: Story = {
  render: (args) => <ConfirmCancelModalDemo {...args} />,
  args: {
    title: 'Confirm Action',
    message: 'Are you sure you want to delete this chart?',
    confirmLabel: 'Confirm',
    cancelLabel: 'Cancel',
    onConfirm: () => console.log('Confirmed'),
    onCancel: () => console.log('Cancelled'),
  },
};
