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

    it('applies headerAlign to the header cell', () => {
      render(
        <table>
          <TableHeader
            headers={[
              { id: 'name' as const, title: 'Name' },
              { id: 'country' as const, title: 'Country', headerAlign: 'center' as const },
              { id: 'value' as const, title: 'Value', headerAlign: 'right' as const },
            ]}
          />
        </table>,
      );

      const name = screen.getByRole('columnheader', { name: /name/i });
      const country = screen.getByRole('columnheader', { name: /country/i });
      const value = screen.getByRole('columnheader', { name: /value/i });
      expect(name).not.toHaveClass('alignCenter', 'alignRight');
      expect(country).toHaveClass('alignCenter');
      expect(value).toHaveClass('alignRight');
    });

    it('does not apply the column align to the header cell', () => {
      render(
        <table>
          <TableHeader
            headers={[{ id: 'value' as const, title: 'Value', align: 'right' as const }]}
          />
        </table>,
      );

      const value = screen.getByRole('columnheader', { name: /value/i });
      expect(value).not.toHaveClass('alignCenter', 'alignRight');
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
