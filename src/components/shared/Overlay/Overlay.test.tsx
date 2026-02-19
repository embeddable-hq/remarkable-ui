import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Overlay } from './Overlay';

describe('Overlay', () => {
  it('renders children', () => {
    render(<Overlay>Content</Overlay>);

    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies the overlay class', () => {
    render(<Overlay>Content</Overlay>);

    expect(screen.getByText('Content')).toHaveClass('overlay');
  });

  it('merges custom className', () => {
    render(<Overlay className="custom-class">Content</Overlay>);

    const element = screen.getByText('Content').closest('div')!;
    expect(element).toHaveClass('overlay');
    expect(element).toHaveClass('custom-class');
  });

  it('renders without children', () => {
    const { container } = render(<Overlay />);

    expect(container.querySelector('div')).toBeInTheDocument();
  });
});
