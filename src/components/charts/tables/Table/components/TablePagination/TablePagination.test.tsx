import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { TablePagination, getTableTotalPages } from './TablePagination';

describe('getTableTotalPages', () => {
  it('calculates total pages by dividing total by pageSize', () => {
    expect(getTableTotalPages(100, 10)).toBe(10);
  });

  it('rounds up when total is not evenly divisible by pageSize', () => {
    expect(getTableTotalPages(101, 10)).toBe(11);
  });

  it('returns 1 when total equals pageSize', () => {
    expect(getTableTotalPages(10, 10)).toBe(1);
  });

  it('returns undefined when total is undefined', () => {
    expect(getTableTotalPages(undefined, 10)).toBeUndefined();
  });

  it('returns undefined when total is 0', () => {
    expect(getTableTotalPages(0, 10)).toBeUndefined();
  });

  it('returns 1 when total is less than pageSize', () => {
    expect(getTableTotalPages(5, 10)).toBe(1);
  });
});

describe('TablePagination', () => {
  const defaultProps = {
    page: 0,
    pageSize: 10,
    total: 50,
    onPageChange: vi.fn(),
  };

  describe('page label', () => {
    it('displays the current page number (1-indexed) and total pages', () => {
      render(<TablePagination {...defaultProps} page={0} total={50} pageSize={10} />);

      expect(screen.getByText('Page 1 of 5')).toBeInTheDocument();
    });

    it('updates the page number when page prop changes', () => {
      render(<TablePagination {...defaultProps} page={2} total={50} pageSize={10} />);

      expect(screen.getByText('Page 3 of 5')).toBeInTheDocument();
    });

    it('shows "?" for total pages when total is undefined', () => {
      render(<TablePagination page={0} pageSize={10} total={undefined} onPageChange={vi.fn()} />);

      expect(screen.getByText('Page 1 of ?')).toBeInTheDocument();
    });

    it('shows a custom paginationLabel when provided', () => {
      render(<TablePagination {...defaultProps} paginationLabel="Showing page 1" />);

      expect(screen.getByText('Showing page 1')).toBeInTheDocument();
    });
  });

  describe('disabled states', () => {
    it('disables first and previous buttons on the first page', () => {
      render(<TablePagination {...defaultProps} page={0} />);

      expect(screen.getByRole('button', { name: 'First page' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled();
    });

    it('enables next and last buttons when not on the last page', () => {
      render(<TablePagination {...defaultProps} page={0} total={50} pageSize={10} />);

      expect(screen.getByRole('button', { name: 'Next page' })).not.toBeDisabled();
      expect(screen.getByRole('button', { name: 'Last page' })).not.toBeDisabled();
    });

    it('disables next and last buttons on the last page', () => {
      render(<TablePagination {...defaultProps} page={4} total={50} pageSize={10} />);

      expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Last page' })).toBeDisabled();
    });

    it('enables first and previous buttons when not on the first page', () => {
      render(<TablePagination {...defaultProps} page={2} total={50} pageSize={10} />);

      expect(screen.getByRole('button', { name: 'First page' })).not.toBeDisabled();
      expect(screen.getByRole('button', { name: 'Previous page' })).not.toBeDisabled();
    });

    it('disables next and last buttons when total is undefined', () => {
      render(<TablePagination page={0} pageSize={10} total={undefined} onPageChange={vi.fn()} />);

      expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Last page' })).toBeDisabled();
    });
  });

  describe('navigation callbacks', () => {
    it('calls onPageChange with 0 when first page button is clicked', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(<TablePagination page={3} pageSize={10} total={50} onPageChange={onPageChange} />);

      await user.click(screen.getByRole('button', { name: 'First page' }));

      expect(onPageChange).toHaveBeenCalledWith(0);
    });

    it('calls onPageChange with page - 1 when previous button is clicked', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(<TablePagination page={3} pageSize={10} total={50} onPageChange={onPageChange} />);

      await user.click(screen.getByRole('button', { name: 'Previous page' }));

      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it('calls onPageChange with page + 1 when next button is clicked', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(<TablePagination page={2} pageSize={10} total={50} onPageChange={onPageChange} />);

      await user.click(screen.getByRole('button', { name: 'Next page' }));

      expect(onPageChange).toHaveBeenCalledWith(3);
    });

    it('calls onPageChange with totalPages - 1 when last page button is clicked', async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();
      render(<TablePagination page={0} pageSize={10} total={50} onPageChange={onPageChange} />);

      await user.click(screen.getByRole('button', { name: 'Last page' }));

      expect(onPageChange).toHaveBeenCalledWith(4);
    });
  });

  describe('accessibility', () => {
    it('has an aria-label on the pagination container', () => {
      const { container } = render(<TablePagination {...defaultProps} />);

      expect(
        container.querySelector('[aria-label="Table pagination controls"]'),
      ).toBeInTheDocument();
    });
  });
});
