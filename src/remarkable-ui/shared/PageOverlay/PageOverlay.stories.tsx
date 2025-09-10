import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';

import { PageOverlay } from './PageOverlay';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';

const meta = {
  component: PageOverlay,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof PageOverlay>;

export default meta;

type Story = StoryObj<typeof meta>;

const OverlayWithContent = ({ onClose }: { onClose: () => void }) => (
  <PageOverlay>
    <Card style={{ padding: '2rem', maxWidth: '400px', margin: '1rem' }}>
      <h2 style={{ margin: '0 0 1rem 0', color: '#212129' }}>Modal Content</h2>
      <p style={{ margin: '0 0 1.5rem 0', color: '#5c5c66' }}>
        This is content inside the overlay. Use the button to close.
      </p>
      <Button variant="primary" size="medium" onClick={onClose}>
        Close Modal
      </Button>
    </Card>
  </PageOverlay>
);

export const Default: Story = {
  render: () => {
    const [isVisible, setIsVisible] = useState(false);

    return (
      <div style={{ padding: '2rem' }}>
        <h1>Page Overlay Demo</h1>
        <p>Click the button below to show the overlay:</p>
        <Button variant="primary" size="medium" onClick={() => setIsVisible(true)}>
          Show Overlay
        </Button>
        {isVisible && <OverlayWithContent onClose={() => setIsVisible(false)} />}
      </div>
    );
  },
};

export const WithCustomContent: Story = {
  render: () => {
    const [isVisible, setIsVisible] = useState(false);

    return (
      <div style={{ padding: '2rem' }}>
        <h1>Custom Content Overlay</h1>
        <p>This overlay contains custom content:</p>
        <Button variant="secondary" size="medium" onClick={() => setIsVisible(true)}>
          Show Custom Overlay
        </Button>
        {isVisible && (
          <PageOverlay>
            <div
              style={{
                background: 'white',
                padding: '3rem',
                borderRadius: '8px',
                textAlign: 'center',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
              }}
            >
              <h2 style={{ color: '#212129', marginBottom: '1rem' }}>Custom Modal</h2>
              <p style={{ color: '#5c5c66', marginBottom: '2rem' }}>
                This is a custom modal with different styling.
              </p>
              <Button variant="primary" size="medium" onClick={() => setIsVisible(false)}>
                Close
              </Button>
            </div>
          </PageOverlay>
        )}
      </div>
    );
  },
};

export const SimpleOverlay: Story = {
  render: () => {
    const [isVisible, setIsVisible] = useState(false);

    return (
      <div style={{ padding: '2rem' }}>
        <h1>Simple Overlay</h1>
        <p>This is a simple overlay without click functionality:</p>
        <Button variant="primary" size="medium" onClick={() => setIsVisible(true)}>
          Show Simple Overlay
        </Button>
        {isVisible && (
          <PageOverlay>
            <Card style={{ padding: '2rem', maxWidth: '400px', margin: '1rem' }}>
              <h2 style={{ margin: '0 0 1rem 0', color: '#212129' }}>Simple Modal</h2>
              <p style={{ margin: '0 0 1.5rem 0', color: '#5c5c66' }}>
                This overlay cannot be closed by clicking outside. You must use the button.
              </p>
              <Button variant="primary" size="medium" onClick={() => setIsVisible(false)}>
                Close Modal
              </Button>
            </Card>
          </PageOverlay>
        )}
      </div>
    );
  },
};
