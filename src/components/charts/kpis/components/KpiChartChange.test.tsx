import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { KpiChartChange } from './KpiChartChange';

describe('KpiChartChange', () => {
  describe('difference display', () => {
    it('shows a positive difference with a + prefix', () => {
      render(<KpiChartChange value={120} comparisonValue={100} />);

      expect(screen.getAllByText('+20')[0]).toBeInTheDocument();
    });

    it('shows a negative difference without a + prefix', () => {
      render(<KpiChartChange value={80} comparisonValue={100} />);

      expect(screen.getAllByText('-20')[0]).toBeInTheDocument();
    });

    it('does not show a badge when value equals comparisonValue', () => {
      render(
        <KpiChartChange
          value={100}
          comparisonValue={100}
          equalComparisonLabel="No change"
          comparisonLabel="vs prev"
        />,
      );

      expect(screen.queryByText('+0')).not.toBeInTheDocument();
      expect(screen.queryByText('-0')).not.toBeInTheDocument();
    });
  });

  describe('percentage mode', () => {
    it('shows percentage when showChangeAsPercentage is true', () => {
      render(<KpiChartChange value={110} comparisonValue={100} showChangeAsPercentage />);

      expect(screen.getAllByText('+10.0%')[0]).toBeInTheDocument();
    });

    it('shows negative percentage correctly', () => {
      render(<KpiChartChange value={90} comparisonValue={100} showChangeAsPercentage />);

      expect(screen.getAllByText('-10.0%')[0]).toBeInTheDocument();
    });

    it('respects percentageDecimalPlaces', () => {
      render(
        <KpiChartChange
          value={115}
          comparisonValue={100}
          showChangeAsPercentage
          percentageDecimalPlaces={2}
        />,
      );

      expect(screen.getAllByText('+15.00%')[0]).toBeInTheDocument();
    });

    it('shows noPreviousDataLabel when comparisonValue is 0 and showChangeAsPercentage', () => {
      render(
        <KpiChartChange
          value={100}
          comparisonValue={0}
          showChangeAsPercentage
          noPreviousDataLabel="No previous data"
        />,
      );

      expect(screen.getAllByText('No previous data')[0]).toBeInTheDocument();
    });

    it('does not show a badge in the visible section when noPreviousData', () => {
      const { container } = render(
        <KpiChartChange
          value={100}
          comparisonValue={0}
          showChangeAsPercentage
          noPreviousDataLabel="No previous data"
        />,
      );

      const absoluteContainer = container.querySelector('.kpiAbsoluteContainer');
      expect(absoluteContainer?.querySelector('.kpiChangeBadge')).not.toBeInTheDocument();
    });
  });

  describe('comparison label', () => {
    it('shows comparisonLabel', () => {
      render(<KpiChartChange value={120} comparisonValue={100} comparisonLabel="vs last month" />);

      expect(screen.getAllByText('vs last month')[0]).toBeInTheDocument();
    });

    it('shows equalComparisonLabel when values are equal', () => {
      render(
        <KpiChartChange
          value={100}
          comparisonValue={100}
          comparisonLabel="vs prev"
          equalComparisonLabel="No change"
        />,
      );

      expect(screen.getAllByText('No change')[0]).toBeInTheDocument();
    });

    it('falls back to comparisonLabel when equalComparisonLabel is not set and values are equal', () => {
      render(<KpiChartChange value={100} comparisonValue={100} comparisonLabel="vs prev" />);

      expect(screen.getAllByText('vs prev')[0]).toBeInTheDocument();
    });
  });

  describe('valueFormatter', () => {
    it('uses valueFormatter to format the difference', () => {
      render(
        <KpiChartChange value={1100} comparisonValue={1000} valueFormatter={(v) => `$${v}`} />,
      );

      expect(screen.getAllByText('+$100')[0]).toBeInTheDocument();
    });

    it('does not apply valueFormatter in percentage mode', () => {
      render(
        <KpiChartChange
          value={1100}
          comparisonValue={1000}
          showChangeAsPercentage
          valueFormatter={(v) => `$${v}`}
        />,
      );

      expect(screen.getAllByText('+10.0%')[0]).toBeInTheDocument();
    });
  });

  describe('invertChangeColors', () => {
    it('applies negative class for positive change when invertChangeColors is true', () => {
      const { container } = render(
        <KpiChartChange value={120} comparisonValue={100} invertChangeColors />,
      );

      const badges = container.querySelectorAll('.kpiChangeBadge');
      expect(badges[0]).toHaveClass('negative');
    });

    it('applies positive class for positive change when invertChangeColors is false', () => {
      const { container } = render(
        <KpiChartChange value={120} comparisonValue={100} invertChangeColors={false} />,
      );

      const badges = container.querySelectorAll('.kpiChangeBadge');
      expect(badges[0]).toHaveClass('positive');
    });

    it('applies positive class for negative change when invertChangeColors is true', () => {
      const { container } = render(
        <KpiChartChange value={80} comparisonValue={100} invertChangeColors />,
      );

      const badges = container.querySelectorAll('.kpiChangeBadge');
      expect(badges[0]).toHaveClass('positive');
    });
  });
});
