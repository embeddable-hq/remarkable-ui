import type { Meta } from '@storybook/react-webpack5';
import { useState } from 'react';
import { Dialog } from './Dialog';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';

const meta = {
  title: 'Shared/Dialog',
  component: Dialog,
} satisfies Meta<typeof Dialog>;

export default meta;

export const Default = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      {open && (
        <Dialog open={open} onClose={() => setOpen(false)} ariaLabel="Example dialog">
          <Card style={{ width: '100%', height: '100%' }}>
            Press Escape or click the backdrop to close.
          </Card>
        </Dialog>
      )}
    </>
  );
};

export const InsideTransformedAncestor = () => {
  const [open, setOpen] = useState(false);

  return (
    // A transformed ancestor traps position:fixed descendants; the dialog
    // escapes it via the top layer.
    <div style={{ transform: 'translate3d(0, 0, 0)', width: 240, padding: 16 }}>
      <Button onClick={() => setOpen(true)}>Open from transformed cell</Button>
      {open && (
        <Dialog open={open} onClose={() => setOpen(false)} ariaLabel="Example dialog">
          <Card style={{ width: '100%', height: '100%' }}>
            Fills the viewport despite the transformed ancestor.
          </Card>
        </Dialog>
      )}
    </div>
  );
};
