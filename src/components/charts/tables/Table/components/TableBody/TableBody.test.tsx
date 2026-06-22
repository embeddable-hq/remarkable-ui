import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TableBody } from './TableBody';

type Row = { name: string; value: number };

const HEADERS = [
  { id: 'name' as const, title: 'Name' },
  { id: 'value' as const, title: 'Value' },
];

const ROWS: Row[] = [
  { name: 'Alice', value: 10 },
  { name: 'Bob', value: 20 },
];

describe('TableBody', () => {
  describe('rendering', () => {
    it('renders a row for each item in rows', () => {
      render(
        <table>
          <TableBody headers={HEADERS} rows={ROWS} />
        </table>,
      );

      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
    });

    it('renders cell values using header id by default', () => {
      render(
        <table>
          <TableBody headers={HEADERS} rows={ROWS} />
        </table>,
      );

      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('20')).toBeInTheDocument();
    });

    it('renders cell values using accessor when provided', () => {
      const headersWithAccessor = [
        { id: 'name' as const, title: 'Name', accessor: (row: Row) => `${row.name}!` },
      ];

      render(
        <table>
          <TableBody headers={headersWithAccessor} rows={ROWS} />
        </table>,
      );

      expect(screen.getByText('Alice!')).toBeInTheDocument();
    });

    it('shows index column when showIndex is true', () => {
      render(
        <table>
          <TableBody headers={HEADERS} rows={ROWS} showIndex />
        </table>,
      );

      expect(screen.getByText('1')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('uses paginated index when page and pageSize are provided', () => {
      render(
        <table>
          <TableBody headers={HEADERS} rows={ROWS} showIndex page={1} pageSize={10} />
        </table>,
      );

      expect(screen.getByText('11')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
    });
  });

  describe('onRowIndexClick', () => {
    it('calls onRowIndexClick with row index when a row is clicked', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(
        <table>
          <TableBody headers={HEADERS} rows={ROWS} onRowIndexClick={handleClick} />
        </table>,
      );

      await user.click(screen.getByText('Alice'));

      expect(handleClick).toHaveBeenCalledWith(0);
    });
  });

  describe('onCellClick', () => {
    it('calls onCellClick with cell details when a cell is clicked', async () => {
      const user = userEvent.setup();
      const handleCellClick = vi.fn();

      render(
        <table>
          <TableBody headers={HEADERS} rows={ROWS} onCellClick={handleCellClick} />
        </table>,
      );

      await user.click(screen.getByText('Alice'));

      expect(handleCellClick).toHaveBeenCalledWith({
        rowIndex: 0,
        columnId: 'name',
        value: 'Alice',
        row: ROWS[0],
      });
    });

    it('passes the raw (unformatted) value for the clicked column', async () => {
      const user = userEvent.setup();
      const handleCellClick = vi.fn();

      render(
        <table>
          <TableBody headers={HEADERS} rows={ROWS} onCellClick={handleCellClick} />
        </table>,
      );

      await user.click(screen.getByText('20'));

      expect(handleCellClick).toHaveBeenCalledWith({
        rowIndex: 1,
        columnId: 'value',
        value: 20,
        row: ROWS[1],
      });
    });

    it('does not fire onRowIndexClick when a cell is clicked', async () => {
      const user = userEvent.setup();
      const handleCellClick = vi.fn();
      const handleRowClick = vi.fn();

      render(
        <table>
          <TableBody
            headers={HEADERS}
            rows={ROWS}
            onCellClick={handleCellClick}
            onRowIndexClick={handleRowClick}
          />
        </table>,
      );

      await user.click(screen.getByText('Alice'));

      expect(handleCellClick).toHaveBeenCalledTimes(1);
      expect(handleRowClick).not.toHaveBeenCalled();
    });
  });
});
