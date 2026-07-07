import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { HeatMap } from './HeatMap';

type Row = { region: string; quarter: string; sales: number | null };

const MOCK_DATA: Row[] = [
  { region: 'North', quarter: 'Q1', sales: 100 },
  { region: 'North', quarter: 'Q2', sales: 200 },
  { region: 'South', quarter: 'Q1', sales: 50 },
  { region: 'South', quarter: 'Q2', sales: 150 },
];

const DEFAULT_PROPS = {
  data: MOCK_DATA,
  rowDimension: { key: 'region' as const, label: 'Region' },
  columnDimension: { key: 'quarter' as const, label: 'Quarter' },
  measure: { key: 'sales' as const, label: 'Sales' },
};

describe('HeatMap', () => {
  describe('rendering', () => {
    it('renders a table with aria-label', () => {
      render(<HeatMap {...DEFAULT_PROPS} />);

      expect(screen.getByRole('table', { name: 'Heat map' })).toBeInTheDocument();
    });

    it('renders column headers from data', () => {
      render(<HeatMap {...DEFAULT_PROPS} />);

      expect(screen.getByRole('columnheader', { name: 'Q1' })).toBeInTheDocument();
      expect(screen.getByRole('columnheader', { name: 'Q2' })).toBeInTheDocument();
    });

    it('renders row headers from data', () => {
      render(<HeatMap {...DEFAULT_PROPS} />);

      expect(screen.getByRole('rowheader', { name: 'North' })).toBeInTheDocument();
      expect(screen.getByRole('rowheader', { name: 'South' })).toBeInTheDocument();
    });

    it('renders the measure label in the header', () => {
      render(<HeatMap {...DEFAULT_PROPS} />);

      expect(screen.getByText('Sales')).toBeInTheDocument();
    });
  });

  describe('showValues', () => {
    it('does not show cell values by default', () => {
      render(<HeatMap {...DEFAULT_PROPS} />);

      expect(screen.queryByText('100')).not.toBeInTheDocument();
    });

    it('shows cell values when showValues is true', () => {
      render(<HeatMap {...DEFAULT_PROPS} showValues />);

      expect(screen.getByText('100')).toBeInTheDocument();
      expect(screen.getByText('200')).toBeInTheDocument();
    });
  });

  describe('displayNullAs', () => {
    it('displays the displayNullAs value for null cells', () => {
      const dataWithNull: Row[] = [
        { region: 'North', quarter: 'Q1', sales: null },
        { region: 'North', quarter: 'Q2', sales: 200 },
      ];

      render(<HeatMap {...DEFAULT_PROPS} data={dataWithNull} showValues displayNullAs="N/A" />);

      expect(screen.getByText('N/A')).toBeInTheDocument();
    });
  });

  describe('onCellClick', () => {
    it('calls onCellClick with row and column values when a cell is clicked', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<HeatMap {...DEFAULT_PROPS} onCellClick={handleClick} />);

      // First button is the North × Q1 cell (columns render in data order)
      await user.click(screen.getAllByRole('button')[0]!);

      expect(handleClick).toHaveBeenCalledWith({
        rowDimensionValue: 'North',
        columnDimensionValue: 'Q1',
      });
    });

    it('triggers onCellClick on Enter key press', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<HeatMap {...DEFAULT_PROPS} onCellClick={handleClick} />);

      const [firstCellEnter] = screen.getAllByRole('button');
      firstCellEnter!.focus();
      await user.keyboard('{Enter}');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('triggers onCellClick on Space key press', async () => {
      const user = userEvent.setup();
      const handleClick = vi.fn();

      render(<HeatMap {...DEFAULT_PROPS} onCellClick={handleClick} />);

      const [firstCellSpace] = screen.getAllByRole('button');
      firstCellSpace!.focus();
      await user.keyboard(' ');

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('renders cells as buttons with tabIndex when onCellClick is provided', () => {
      render(<HeatMap {...DEFAULT_PROPS} onCellClick={vi.fn()} />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
      buttons.forEach((btn) => expect(btn).toHaveAttribute('tabindex', '0'));
    });

    it('renders no button role or tabIndex on cells without onCellClick', () => {
      render(<HeatMap {...DEFAULT_PROPS} />);

      expect(screen.queryAllByRole('button')).toHaveLength(0);
    });
  });

  describe('dimension formatting', () => {
    it('formats column dimension values using provided format function', () => {
      render(
        <HeatMap
          {...DEFAULT_PROPS}
          columnDimension={{
            key: 'quarter',
            label: 'Quarter',
            format: (v) => `Quarter ${v}`,
          }}
        />,
      );

      expect(screen.getByText('Quarter Q1')).toBeInTheDocument();
    });

    it('formats row dimension values using provided format function', () => {
      render(
        <HeatMap
          {...DEFAULT_PROPS}
          rowDimension={{
            key: 'region',
            label: 'Region',
            format: (v) => `Region: ${v}`,
          }}
        />,
      );

      expect(screen.getByText('Region: North')).toBeInTheDocument();
    });
  });
});
