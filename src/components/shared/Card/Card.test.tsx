import { render, screen } from '@testing-library/react';
import { createRef } from 'react';
import { describe, expect, it } from 'vitest';
import { Card, CardContent, CardHeader } from './Card';

describe('Card', () => {
  describe('rendering', () => {
    it('renders children', () => {
      render(<Card>Card content</Card>);

      expect(screen.getByText('Card content')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const { container } = render(<Card className="custom-class">Content</Card>);

      expect(container.firstChild).toHaveClass('custom-class');
    });
  });

  describe('ref forwarding', () => {
    it('forwards ref to the div element', () => {
      const ref = createRef<HTMLDivElement>();

      render(<Card ref={ref}>Content</Card>);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});

describe('CardHeader', () => {
  describe('rendering', () => {
    it('renders title when provided', () => {
      render(<CardHeader title="My Card" />);

      expect(screen.getByText('My Card')).toBeInTheDocument();
    });

    it('renders subtitle when provided', () => {
      render(<CardHeader subtitle="A subtitle" />);

      expect(screen.getByText('A subtitle')).toBeInTheDocument();
    });

    it('renders info button with tooltip when tooltip is provided', () => {
      render(<CardHeader tooltip="Tooltip content" />);

      expect(screen.getByRole('button', { name: 'Info' })).toBeInTheDocument();
    });

    it('returns null when no title, subtitle, or tooltip is provided', () => {
      const { container } = render(<CardHeader />);

      expect(container.firstChild).toBeNull();
    });
  });
});

describe('CardContent', () => {
  describe('rendering', () => {
    it('renders children', () => {
      render(<CardContent>Chart here</CardContent>);

      expect(screen.getByText('Chart here')).toBeInTheDocument();
    });
  });

  describe('ref forwarding', () => {
    it('forwards ref to the div element', () => {
      const ref = createRef<HTMLDivElement>();

      render(<CardContent ref={ref}>Content</CardContent>);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });
});
