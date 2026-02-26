import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { SelectFieldContent, SelectFieldContentList } from './SelectFieldContent';

const ThreeButtons = () => (
  <>
    <button>Option A</button>
    <button>Option B</button>
    <button>Option C</button>
  </>
);

describe('SelectFieldContent', () => {
  describe('rendering', () => {
    it('renders children', () => {
      render(
        <SelectFieldContent>
          <button>Item</button>
        </SelectFieldContent>,
      );

      expect(screen.getByText('Item')).toBeInTheDocument();
    });
  });

  describe('keyboard navigation', () => {
    it('moves focus to the next item on ArrowDown', async () => {
      const user = userEvent.setup();

      render(
        <SelectFieldContent>
          <ThreeButtons />
        </SelectFieldContent>,
      );

      // currentIndex starts at 0 (Option A); ArrowDown moves to index 1
      screen.getByText('Option A').focus();
      await user.keyboard('{ArrowDown}');

      expect(screen.getByText('Option B')).toHaveFocus();
    });

    it('moves focus to the previous item on ArrowUp after navigating forward', async () => {
      const user = userEvent.setup();

      render(
        <SelectFieldContent>
          <ThreeButtons />
        </SelectFieldContent>,
      );

      // Navigate to Option B first (currentIndex → 1), then back
      screen.getByText('Option A').focus();
      await user.keyboard('{ArrowDown}'); // currentIndex → 1, focus Option B
      await user.keyboard('{ArrowUp}'); // currentIndex → 0, focus Option A

      expect(screen.getByText('Option A')).toHaveFocus();
    });

    it('wraps to the last item when ArrowUp is pressed on the first item', async () => {
      const user = userEvent.setup();

      render(
        <SelectFieldContent>
          <ThreeButtons />
        </SelectFieldContent>,
      );

      // currentIndex starts at 0; ArrowUp wraps to last index
      screen.getByText('Option A').focus();
      await user.keyboard('{ArrowUp}');

      expect(screen.getByText('Option C')).toHaveFocus();
    });

    it('wraps to the first item when ArrowDown is pressed on the last item', async () => {
      const user = userEvent.setup();

      render(
        <SelectFieldContent>
          <ThreeButtons />
        </SelectFieldContent>,
      );

      // Navigate to Option C via keyboard (currentIndex 0→1→2), then wrap
      screen.getByText('Option A').focus();
      await user.keyboard('{ArrowDown}'); // → Option B (index 1)
      await user.keyboard('{ArrowDown}'); // → Option C (index 2)
      await user.keyboard('{ArrowDown}'); // wraps → Option A (index 0)

      expect(screen.getByText('Option A')).toHaveFocus();
    });

    it('moves focus to the first item on Home key', async () => {
      const user = userEvent.setup();

      render(
        <SelectFieldContent>
          <ThreeButtons />
        </SelectFieldContent>,
      );

      screen.getByText('Option A').focus();
      await user.keyboard('{ArrowDown}'); // → Option B
      await user.keyboard('{Home}');

      expect(screen.getByText('Option A')).toHaveFocus();
    });

    it('moves focus to the last item on End key', async () => {
      const user = userEvent.setup();

      render(
        <SelectFieldContent>
          <ThreeButtons />
        </SelectFieldContent>,
      );

      screen.getByText('Option A').focus();
      await user.keyboard('{End}');

      expect(screen.getByText('Option C')).toHaveFocus();
    });
  });
});

describe('SelectFieldContentList', () => {
  describe('rendering', () => {
    it('renders children', () => {
      render(
        <SelectFieldContentList>
          <span>Item</span>
        </SelectFieldContentList>,
      );

      expect(screen.getByText('Item')).toBeInTheDocument();
    });

    it('applies disabled class when disabled is true', () => {
      const { container } = render(
        <SelectFieldContentList disabled>
          <span>Item</span>
        </SelectFieldContentList>,
      );

      expect(container.firstChild).toHaveClass('disabled');
    });
  });
});
