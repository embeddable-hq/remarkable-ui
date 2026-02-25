import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Divider } from './Divider';

describe('Divider', () => {
  describe('orientation', () => {
    it('renders without vertical class by default', () => {
      const { container } = render(<Divider />);

      expect(container.firstChild).not.toHaveClass('vertical');
    });

    it('applies vertical class when vertical prop is true', () => {
      const { container } = render(<Divider vertical />);

      expect(container.firstChild).toHaveClass('vertical');
    });
  });

  describe('color', () => {
    it('applies color as backgroundColor inline style', () => {
      const { container } = render(<Divider color="#ff0000" />);

      expect(container.firstChild).toHaveStyle({ backgroundColor: '#ff0000' });
    });

    it('does not apply backgroundColor when color is not provided', () => {
      const { container } = render(<Divider />);

      const divider = container.firstElementChild as HTMLElement;
      expect(divider.style.backgroundColor).toBe('');
    });
  });

  describe('thickness', () => {
    it('applies thickness as height for horizontal divider', () => {
      const { container } = render(<Divider thickness={2} />);

      expect(container.firstChild).toHaveStyle({ height: '2px' });
    });

    it('applies thickness as width for vertical divider', () => {
      const { container } = render(<Divider thickness={2} vertical />);

      expect(container.firstChild).toHaveStyle({ width: '2px' });
    });
  });

  describe('className', () => {
    it('applies custom className', () => {
      const { container } = render(<Divider className="my-divider" />);

      expect(container.firstChild).toHaveClass('my-divider');
    });
  });
});
