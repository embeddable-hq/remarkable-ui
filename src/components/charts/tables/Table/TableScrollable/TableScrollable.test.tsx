import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TableScrollable } from './TableScrollable';

type Row = { id: string; name: string };

const HEADERS = [{ id: 'name' as const, title: 'Name' }];

const ROWS: Row[] = [
  { id: '1', name: 'Alice' },
  { id: '2', name: 'Bob' },
];

const DEFAULT_PROPS = {
  headers: HEADERS,
  rows: ROWS,
  onNextPage: vi.fn(),
};

describe('TableScrollable', () => {
  describe('rendering', () => {
    it('renders the table with aria-label', () => {
      render(<TableScrollable {...DEFAULT_PROPS} hasMoreData={false} />);

      expect(screen.getByRole('table', { name: 'Scrollable table' })).toBeInTheDocument();
    });

    it('renders column headers', () => {
      render(<TableScrollable {...DEFAULT_PROPS} hasMoreData={false} />);

      expect(screen.getByRole('columnheader', { name: /name/i })).toBeInTheDocument();
    });

    it('renders row data', () => {
      render(<TableScrollable {...DEFAULT_PROPS} hasMoreData={false} />);

      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();
    });
  });

  describe('loading state', () => {
    it('shows loading label when isLoading is true', () => {
      render(<TableScrollable {...DEFAULT_PROPS} isLoading />);

      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('shows custom loadingLabel when provided', () => {
      render(<TableScrollable {...DEFAULT_PROPS} isLoading loadingLabel="Fetching data..." />);

      expect(screen.getByText('Fetching data...')).toBeInTheDocument();
    });

    it('does not show loading label when isLoading is false', () => {
      render(<TableScrollable {...DEFAULT_PROPS} isLoading={false} />);

      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });

  describe('infinite scroll', () => {
    it('calls onNextPage on mount when hasMoreData is true and not loading', () => {
      const onNextPage = vi.fn();

      render(<TableScrollable headers={HEADERS} rows={ROWS} onNextPage={onNextPage} hasMoreData />);

      expect(onNextPage).toHaveBeenCalled();
    });

    it('does not call onNextPage when hasMoreData is false', () => {
      const onNextPage = vi.fn();

      render(
        <TableScrollable
          headers={HEADERS}
          rows={ROWS}
          onNextPage={onNextPage}
          hasMoreData={false}
        />,
      );

      expect(onNextPage).not.toHaveBeenCalled();
    });

    it('does not call onNextPage when isLoading is true', () => {
      const onNextPage = vi.fn();

      render(
        <TableScrollable
          headers={HEADERS}
          rows={ROWS}
          onNextPage={onNextPage}
          hasMoreData
          isLoading
        />,
      );

      expect(onNextPage).not.toHaveBeenCalled();
    });
  });
});
