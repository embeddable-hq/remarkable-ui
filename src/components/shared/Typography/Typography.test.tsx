import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Typography } from './Typography';

describe('Typography', () => {
  describe('element type', () => {
    it('renders as <p> by default', () => {
      render(<Typography>Hello</Typography>);

      expect(screen.getByText('Hello').tagName).toBe('P');
    });

    it('renders as <span> when as="span"', () => {
      render(<Typography as="span">Hello</Typography>);

      expect(screen.getByText('Hello').tagName).toBe('SPAN');
    });

    it('renders as <h1> when as="h1"', () => {
      render(<Typography as="h1">Heading</Typography>);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Heading');
    });

    it('renders as <label> when as="label"', () => {
      render(<Typography as="label">Label text</Typography>);

      expect(screen.getByText('Label text').tagName).toBe('LABEL');
    });

    it('renders as <div> when as="div"', () => {
      render(<Typography as="div">Div content</Typography>);

      expect(screen.getByText('Div content').tagName).toBe('DIV');
    });
  });

  describe('content', () => {
    it('renders children', () => {
      render(<Typography>Some text</Typography>);

      expect(screen.getByText('Some text')).toBeInTheDocument();
    });
  });

  describe('props', () => {
    it('applies custom className', () => {
      render(<Typography className="custom">Text</Typography>);

      expect(screen.getByText('Text')).toHaveClass('custom');
    });

    it('applies title attribute', () => {
      render(<Typography title="tooltip text">Text</Typography>);

      expect(screen.getByText('Text')).toHaveAttribute('title', 'tooltip text');
    });

    it('applies inline style', () => {
      render(<Typography style={{ color: 'rgb(255, 0, 0)' }}>Text</Typography>);

      expect(screen.getByText('Text')).toHaveStyle({ color: 'rgb(255, 0, 0)' });
    });
  });
});
