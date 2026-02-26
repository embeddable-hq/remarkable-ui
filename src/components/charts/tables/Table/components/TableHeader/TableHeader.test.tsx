import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TableHeader } from './TableHeader';

const HEADERS = [
  { id: 'name' as const, title: 'Name' },
  { id: 'value' as const, title: 'Value' },
];

describe('TableHeader', () => {
  describe('rendering', () => {
    it('renders column header buttons for each header', () => {
      render(
        <table>
          <TableHeader headers={HEADERS} />
        </table>,
      );

      expect(screen.getByRole('columnheader', { name: /name/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /value/i })).toBeInTheDocument();
    });

    it('renders index column header when showIndex is true', () => {
      render(
        <table>
          <TableHeader headers={HEADERS} showIndex />
        </table>,
      );

      expect(screen.getByText('#')).toBeInTheDocument();
    });

    it('does not render index column when showIndex is false', () => {
      render(
        <table>
          <TableHeader headers={HEADERS} showIndex={false} />
        </table>,
      );

      expect(screen.queryByText('#')).not.toBeInTheDocument();
    });
  });

  describe('sort', () => {
    it('calls onSortChange with ascending sort when a header button is clicked', async () => {
      const user = userEvent.setup();
      const handleSortChange = vi.fn();

      render(
        <table>
          <TableHeader headers={HEADERS} onSortChange={handleSortChange} />
        </table>,
      );

      await user.click(screen.getByRole('button', { name: /sort by name/i }));

      await waitFor(() =>
        expect(handleSortChange).toHaveBeenCalledWith({ id: 'name', direction: 'asc' }),
      );
    });

    it('cycles sort direction from asc to desc on second click', async () => {
      const user = userEvent.setup();
      const handleSortChange = vi.fn();

      render(
        <table>
          <TableHeader
            headers={HEADERS}
            sort={{ id: 'name', direction: 'asc' }}
            onSortChange={handleSortChange}
          />
        </table>,
      );

      await user.click(screen.getByRole('button', { name: /sort by name/i }));

      await waitFor(() =>
        expect(handleSortChange).toHaveBeenCalledWith({ id: 'name', direction: 'desc' }),
      );
    });

    it('sets aria-sort to ascending when current sort matches header and direction is asc', () => {
      render(
        <table>
          <TableHeader headers={HEADERS} sort={{ id: 'name', direction: 'asc' }} />
        </table>,
      );

      expect(screen.getByRole('columnheader', { name: /name/i })).toHaveAttribute(
        'aria-sort',
        'ascending',
      );
    });

    it('sets aria-sort to none for headers not currently sorted', () => {
      render(
        <table>
          <TableHeader headers={HEADERS} sort={{ id: 'name', direction: 'asc' }} />
        </table>,
      );

      expect(screen.getByRole('columnheader', { name: /value/i })).toHaveAttribute(
        'aria-sort',
        'none',
      );
    });
  });
});
