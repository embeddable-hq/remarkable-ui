import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('renders a div element', () => {
    const { container } = render(<Skeleton />);

    expect(container.querySelector('div')).toBeInTheDocument();
  });

  it('applies the skeleton class', () => {
    const { container } = render(<Skeleton />);

    expect(container.firstChild).toHaveClass('skeleton');
  });
});
