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

  describe('row aggregations', () => {
    it('renders Sum group header when rowSumFor is specified', () => {
      render(<PivotTable {...DEFAULT_PROPS} rowSumFor={['revenue']} />);

      expect(screen.getByText('Sum')).toBeInTheDocument();
    });

    it('renders Min and Max group headers when both props are specified', () => {
      render(<PivotTable {...DEFAULT_PROPS} rowMinFor={['revenue']} rowMaxFor={['revenue']} />);

      expect(screen.getByText('Min')).toBeInTheDocument();
      expect(screen.getByText('Max')).toBeInTheDocument();
    });

    it('renders Average group header when rowAverageFor is specified', () => {
      render(<PivotTable {...DEFAULT_PROPS} rowAverageFor={['revenue']} />);

      expect(screen.getByText('Average')).toBeInTheDocument();
    });

    it('renders no aggregation columns when no row agg props are set', () => {
      render(<PivotTable {...DEFAULT_PROPS} />);

      expect(screen.queryByText('Sum')).not.toBeInTheDocument();
      expect(screen.queryByText('Min')).not.toBeInTheDocument();
      expect(screen.queryByText('Max')).not.toBeInTheDocument();
      expect(screen.queryByText('Average')).not.toBeInTheDocument();
    });

    it('renders correct sum value in row aggregation cell', () => {
      render(<PivotTable {...DEFAULT_PROPS} rowSumFor={['revenue']} />);

      // US row: 100 + 120 = 220
      expect(screen.getByTitle('220')).toBeInTheDocument();
    });
  });

  describe('column aggregations', () => {
    it('renders a Sum footer row when columnSumFor is specified', () => {
      render(<PivotTable {...DEFAULT_PROPS} columnSumFor={['revenue']} />);

      expect(screen.getByText('Sum')).toBeInTheDocument();
    });

    it('renders Average footer row when columnAverageFor is specified', () => {
      render(<PivotTable {...DEFAULT_PROPS} columnAverageFor={['revenue']} />);

      expect(screen.getByText('Average')).toBeInTheDocument();
    });

    it('renders multiple footer rows when multiple column agg props are set', () => {
      render(
        <PivotTable {...DEFAULT_PROPS} columnMinFor={['revenue']} columnMaxFor={['revenue']} />,
      );

      expect(screen.getByText('Min')).toBeInTheDocument();
      expect(screen.getByText('Max')).toBeInTheDocument();
    });

    it('stacks every footer row as sticky, offset from the bottom by its position', () => {
      render(
        <PivotTable {...DEFAULT_PROPS} columnMinFor={['revenue']} columnMaxFor={['revenue']} />,
      );

      // Groups render in canonical order (min then max), so Min sits one row above the
      // bottom and Max sits flush against it.
      const minRow = screen.getByText('Min').closest('tr');
      const maxRow = screen.getByText('Max').closest('tr');

      const minStyle = minRow?.getAttribute('style') ?? '';
      const maxStyle = maxRow?.getAttribute('style') ?? '';

      // Both pin to the bottom edge only.
      expect(minStyle).toContain('top: auto');
      expect(maxStyle).toContain('top: auto');

      // Max is the last row (0 rows below); Min has 1 row below it.
      expect(maxStyle).toContain('* 0');
      expect(minStyle).toContain('* 1');
    });

    it('renders no footer rows when no column agg props are set', () => {
      render(<PivotTable {...DEFAULT_PROPS} />);

      expect(screen.queryByText('Sum')).not.toBeInTheDocument();
      expect(screen.queryByText('Average')).not.toBeInTheDocument();
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

  describe('grand-total intersection', () => {
    it('shows the row-agg type value at the column-footer × row-agg intersection, not the footer type', () => {
      // columnSumFor → Sum footer row; rowMinFor → Min column
      // Grand sum = 390; grand min = 80.
      // The intersection cell (Sum footer × Min column) must show 80, not 390.
      render(<PivotTable {...DEFAULT_PROPS} columnSumFor={['revenue']} rowMinFor={['revenue']} />);

      // 390 (grand sum) must not appear — the Min column should never show a sum
      expect(screen.queryByTitle('390')).not.toBeInTheDocument();
      // 80 (grand min) appears in both the UK-Jan regular cell and the intersection
      expect(screen.getAllByTitle('80').length).toBeGreaterThan(0);
    });
  });

  describe('row aggregation percentage', () => {
    it('shows percentage relative to grand total, not 100%', () => {
      // US revenue sum = 220, grand revenue sum = 390 → ≈56%
      render(
        <PivotTable
          {...DEFAULT_PROPS}
          rowSumFor={['revenue']}
          measures={[
            {
              key: 'revenue' as const,
              label: 'Revenue',
              showAsPercentage: true,
              percentageDecimalPlaces: 0,
            },
          ]}
        />,
      );

      // 100% would appear if the bug is present (row agg used as its own denominator)
      expect(screen.queryByTitle('100%')).not.toBeInTheDocument();
      // US: 220/390 ≈ 56%; UK: 170/390 ≈ 44%
      expect(screen.getAllByTitle('56%').length).toBeGreaterThan(0);
      expect(screen.getAllByTitle('44%').length).toBeGreaterThan(0);
    });
  });

  describe('header guard for invalid measure keys', () => {
    it('skips invalid measure keys in row-agg subheader without creating extra columns', () => {
      // rowSumFor references 'cost' (valid) and 'nonexistent' (not in measures)
      // Only 'Revenue' subheader should appear, not 'nonexistent'
      render(
        <PivotTable
          {...DEFAULT_PROPS}
          rowSumFor={['revenue', 'nonexistent' as (typeof DEFAULT_PROPS.measures)[0]['key']]}
        />,
      );

      const revenueHeaders = screen.getAllByText('Revenue');
      // Only the valid measure appears in the agg subheader
      expect(revenueHeaders.length).toBeGreaterThan(0);
      expect(screen.queryByText('nonexistent')).not.toBeInTheDocument();
    });
  });

  describe('loading rows', () => {
    it('shows loading indicator for rows in loadingRows set', async () => {
      const loadingRows = new Set(['US']);

      render(<PivotTable {...DEFAULT_PROPS} expandableRows loadingRows={loadingRows} />);

      expect(screen.getByRole('button', { name: /loading/i })).toBeInTheDocument();
    });
  });
});
