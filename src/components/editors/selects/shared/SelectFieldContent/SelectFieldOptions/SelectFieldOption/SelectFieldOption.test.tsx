import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SelectListOption } from './SelectFieldOption';

vi.mock('@radix-ui/react-dropdown-menu', () => ({
  Item: ({
    children,
    className,
    ...props
  }: React.HTMLAttributes<HTMLDivElement> & { 'data-value'?: string }) => (
    <div className={className} role="menuitem" {...props}>
      {children}
    </div>
  ),
}));

describe('SelectListOption', () => {
  describe('rendering', () => {
    it('renders the label', () => {
      render(<SelectListOption label="Option One" />);

      expect(screen.getByText('Option One')).toBeInTheDocument();
    });

    it('renders rightLabel when provided', () => {
      render(<SelectListOption label="Option" rightLabel="10" />);

      expect(screen.getByText('10')).toBeInTheDocument();
    });

    it('sets data-value attribute when value is provided', () => {
      render(<SelectListOption label="Option" value="opt-1" />);

      expect(screen.getByRole('menuitem')).toHaveAttribute('data-value', 'opt-1');
    });
  });

  describe('selected state', () => {
    it('applies selected class when isSelected is true', () => {
      render(<SelectListOption label="Option" isSelected />);

      expect(screen.getByRole('menuitem')).toHaveClass('selected');
    });

    it('does not apply selected class when isSelected is false', () => {
      render(<SelectListOption label="Option" isSelected={false} />);

      expect(screen.getByRole('menuitem')).not.toHaveClass('selected');
    });
  });

  describe('disabled state', () => {
    it('applies disabled class when disabled is true', () => {
      render(<SelectListOption label="Option" disabled />);

      expect(screen.getByRole('menuitem')).toHaveClass('disabled');
    });
  });

  describe('onClick', () => {
    it('calls onClick when the item is clicked', async () => {
      const handleClick = vi.fn();

      render(<SelectListOption label="Option" onClick={handleClick} />);

      screen.getByRole('menuitem').click();

      expect(handleClick).toHaveBeenCalled();
    });
  });
});
