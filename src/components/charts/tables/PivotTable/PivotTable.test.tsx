import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { PivotTable } from './PivotTable';

type Row = { country: string; month: string; revenue: number; cost: number };

const MOCK_DATA: Row[] = [
  { country: 'US', month: 'Jan', revenue: 100, cost: 40 },
  { country: 'US', month: 'Feb', revenue: 120, cost: 50 },
  { country: 'UK', month: 'Jan', revenue: 80, cost: 30 },
  { country: 'UK', month: 'Feb', revenue: 90, cost: 35 },
];

const DEFAULT_PROPS = {
  data: MOCK_DATA,
  rowDimension: { key: 'country' as const, label: 'Country' },
  columnDimension: { key: 'month' as const, label: 'Month' },
  measures: [{ key: 'revenue' as const, label: 'Revenue' }],
  progressive: false,
};

describe('PivotTable', () => {
  describe('rendering', () => {
    it('renders a table with aria-label combining dimensions', () => {
      render(<PivotTable {...DEFAULT_PROPS} />);

      expect(screen.getByRole('table', { name: 'Country by Month' })).toBeInTheDocument();
    });

    it('renders column dimension values as headers', () => {
      render(<PivotTable {...DEFAULT_PROPS} />);

      expect(screen.getByRole('columnheader', { name: 'Jan' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Feb' })).toBeInTheDocument();
    });

    it('renders row dimension values', () => {
      render(<PivotTable {...DEFAULT_PROPS} />);

      expect(screen.getByText('US')).toBeInTheDocument();
      expect(screen.getByText('UK')).toBeInTheDocument();
    });

    it('renders measure labels in sub-header row', () => {
      render(<PivotTable {...DEFAULT_PROPS} />);

      const revenueHeaders = screen.getAllByText('Revenue');
      expect(revenueHeaders.length).toBeGreaterThan(0);
    });
  });

  describe('row totals', () => {
    it('renders totals column header when rowTotalsFor is specified', () => {
      render(<PivotTable {...DEFAULT_PROPS} rowTotalsFor={['revenue']} totalLabel="Total" />);

      expect(screen.getByText('Total')).toBeInTheDocument();
    });

    it('does not render totals column when rowTotalsFor is empty', () => {
      render(<PivotTable {...DEFAULT_PROPS} rowTotalsFor={[]} />);

      expect(screen.queryByText('Total')).not.toBeInTheDocument();
    });
  });

  describe('column totals', () => {
    it('renders a totals row when columnTotalsFor is specified', () => {
      render(
        <PivotTable {...DEFAULT_PROPS} columnTotalsFor={['revenue']} totalLabel="Grand Total" />,
      );

      expect(screen.getByText('Grand Total')).toBeInTheDocument();
    });
  });

  describe('expandable rows', () => {
    it('shows expand button when expandableRows is true', () => {
      render(<PivotTable {...DEFAULT_PROPS} expandableRows />);

      expect(screen.getByRole('button', { name: /expand us/i })).toBeInTheDocument();
    });

    it('calls onRowExpand when expand button is clicked', async () => {
      const user = userEvent.setup();
      const handleExpand = vi.fn();
      const subRowsByRow = new Map<string, Row[]>();

      render(
        <PivotTable
          {...DEFAULT_PROPS}
          expandableRows
          onRowExpand={handleExpand}
          subRowsByRow={subRowsByRow}
        />,
      );

      await user.click(screen.getByRole('button', { name: /expand us/i }));

      expect(handleExpand).toHaveBeenCalledWith('US');
    });

    it('does not show expand buttons when expandableRows is false', () => {
      render(<PivotTable {...DEFAULT_PROPS} expandableRows={false} />);

      expect(screen.queryByRole('button', { name: /expand/i })).not.toBeInTheDocument();
    });
  });

  describe('loading rows', () => {
    it('shows loading indicator for rows in loadingRows set', async () => {
      const user = userEvent.setup();
      const loadingRows = new Set(['US']);

      render(<PivotTable {...DEFAULT_PROPS} expandableRows loadingRows={loadingRows} />);

      await user.click(screen.getByRole('button', { name: /loading/i }));
    });
  });
});
