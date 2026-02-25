import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DateRangePickerChevron } from './DateRangePickerChevron';

describe('DateRangePickerChevron', () => {
  describe('rendering', () => {
    it('renders a button', () => {
      render(<DateRangePickerChevron />);

      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('orientation', () => {
    it('applies no rotation transform for left orientation', () => {
      render(<DateRangePickerChevron orientation="left" />);

      const button = screen.getByRole('button');
      expect(button).toHaveStyle({ transform: undefined });
    });

    it('applies rotation transform for right orientation', () => {
      render(<DateRangePickerChevron orientation="right" />);

      const button = screen.getByRole('button');
      expect(button).toHaveStyle({ transform: 'rotate(180deg)' });
    });
  });

  describe('size', () => {
    it('applies small class when size is 18', () => {
      render(<DateRangePickerChevron size={18} />);

      expect(screen.getByRole('button')).toHaveClass('small');
    });

    it('does not apply small class for other sizes', () => {
      render(<DateRangePickerChevron size={24} />);

      expect(screen.getByRole('button')).not.toHaveClass('small');
    });
  });
});
