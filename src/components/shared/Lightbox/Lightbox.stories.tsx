import type { Meta } from '@storybook/react-webpack5';
import { useState } from 'react';
import { Lightbox } from './Lightbox';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';

const meta = {
  title: 'Shared/Lightbox',
  component: Lightbox,
} satisfies Meta<typeof Lightbox>;

export default meta;

export const Default = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open lightbox</Button>
      {open && (
        <Lightbox open={open} onClose={() => setOpen(false)} ariaLabel="Example lightbox">
          <Card style={{ width: '100%', height: '100%' }}>
            Press Escape or click the backdrop to close.
          </Card>
        </Lightbox>
      )}
    </>
  );
};

export const InsideTransformedAncestor = () => {
  const [open, setOpen] = useState(false);

  return (
    // A transformed ancestor traps position:fixed descendants; the lightbox
    // escapes it via the top layer.
    <div style={{ transform: 'translate3d(0, 0, 0)', width: 240, padding: 16 }}>
      <Button onClick={() => setOpen(true)}>Open from transformed cell</Button>
      {open && (
        <Lightbox open={open} onClose={() => setOpen(false)} ariaLabel="Example lightbox">
          <Card style={{ width: '100%', height: '100%' }}>
            Fills the viewport despite the transformed ancestor.
          </Card>
        </Lightbox>
      )}
    </div>
  );
};
