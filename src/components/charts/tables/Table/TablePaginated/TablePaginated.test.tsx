import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createRef } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { TablePaginated } from './TablePaginated';

type Row = { id: string; name: string; value: number };

const HEADERS = [
  { id: 'name' as const, title: 'Name' },
  { id: 'value' as const, title: 'Value' },
];

const ROWS: Row[] = [
  { id: '1', name: 'Alice', value: 10 },
  { id: '2', name: 'Bob', value: 20 },
];

const DEFAULT_PROPS = {
  headers: HEADERS,
  rows: ROWS,
  page: 0,
  pageSize: 10,
  total: 2,
  onPageChange: vi.fn(),
};

describe('TablePaginated', () => {
  describe('rendering', () => {
    it('renders column headers', () => {
      render(<TablePaginated {...DEFAULT_PROPS} />);

      expect(screen.getByRole('columnheader', { name: /name/i })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: /value/i })).toBeInTheDocument();
    });

    it('renders row data', () => {
      render(<TablePaginated {...DEFAULT_PROPS} />);

      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
    });

    it('renders index column when showIndex is true', () => {
      render(<TablePaginated {...DEFAULT_PROPS} showIndex />);

      expect(screen.getByText('#')).toBeInTheDocument();
    });

    it('does not render index column when showIndex is false', () => {
      render(<TablePaginated {...DEFAULT_PROPS} showIndex={false} />);

      expect(screen.queryByText('#')).not.toBeInTheDocument();
    });
  });

  describe('ref forwarding', () => {
    it('forwards ref to the container div', () => {
      const ref = createRef<HTMLDivElement>();

      render(<TablePaginated {...DEFAULT_PROPS} ref={ref} />);

      expect(ref.current).toBeInstanceOf(HTMLDivElement);
    });
  });

  describe('onSortChange', () => {
    it('calls onSortChange when a column header is clicked', async () => {
      const user = userEvent.setup();
      const handleSortChange = vi.fn();

      render(<TablePaginated {...DEFAULT_PROPS} onSortChange={handleSortChange} />);

      await user.click(screen.getByRole('button', { name: /sort by name/i }));

      await waitFor(() =>
        expect(handleSortChange).toHaveBeenCalledWith({ id: 'name', direction: 'asc' }),
      );
    });
  });

  describe('onRowIndexClick', () => {
    it('calls onRowIndexClick with row index when a row is clicked', async () => {
      const user = userEvent.setup();
      const handleRowClick = vi.fn();

      render(<TablePaginated {...DEFAULT_PROPS} onRowIndexClick={handleRowClick} />);

      await user.click(screen.getByText('Alice'));

      expect(handleRowClick).toHaveBeenCalledWith(0);
    });
  });
});
