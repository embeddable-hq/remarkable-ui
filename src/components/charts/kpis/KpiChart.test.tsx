import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { KpiChart } from './KpiChart';

vi.mock('auto-text-size', () => ({
  AutoTextSize: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('KpiChart', () => {
  describe('rendering', () => {
    it('renders the value in an h2 element', () => {
      render(<KpiChart value={42} />);

      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('42');
    });

    it('sets the title attribute on the h2 to the displayed value', () => {
      render(<KpiChart value={123} />);

      expect(screen.getByRole('heading', { level: 2 })).toHaveAttribute('title', '123');
    });

    it('applies valueFontSize as inline style on the h2', () => {
      render(<KpiChart value={100} valueFontSize="2rem" />);

      expect(screen.getByRole('heading', { level: 2 })).toHaveStyle({ fontSize: '2rem' });
    });

    it('does not apply font size style when valueFontSize is not provided', () => {
      render(<KpiChart value={100} />);

      expect(screen.getByRole('heading', { level: 2 })).not.toHaveStyle({ fontSize: '2rem' });
    });
  });

  describe('displayNullAs', () => {
    it('shows displayNullAs when value is null', () => {
      render(<KpiChart value={null as unknown as number} displayNullAs="N/A" />);

      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('N/A');
    });

    it('shows empty string by default when value is null', () => {
      render(<KpiChart value={null as unknown as number} />);

      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('');
    });

    it('uses displayNullAs as the h2 title attribute when value is null', () => {
      render(<KpiChart value={null as unknown as number} displayNullAs="–" />);

      expect(screen.getByRole('heading', { level: 2 })).toHaveAttribute('title', '–');
    });
  });

  describe('valueFormatter', () => {
    it('formats the value using valueFormatter', () => {
      render(<KpiChart value={1000} valueFormatter={(v) => `$${v}`} />);

      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('$1000');
    });

    it('uses formatted value as h2 title', () => {
      render(<KpiChart value={500} valueFormatter={(v) => `€${v}`} />);

      expect(screen.getByRole('heading', { level: 2 })).toHaveAttribute('title', '€500');
    });
  });

  describe('comparison section', () => {
    it('hides the comparison content when no comparisonValue is provided', () => {
      const { container } = render(<KpiChart value={100} />);

      const comparisonDiv = container.querySelector('.kpiComparisonContainer > div');

      expect(comparisonDiv).toHaveStyle({ visibility: 'hidden' });
    });

    it('shows the comparison content when comparisonValue is provided', () => {
      const { container } = render(<KpiChart value={100} comparisonValue={80} />);

      const comparisonDiv = container.querySelector('.kpiComparisonContainer > div');

      expect(comparisonDiv).toHaveStyle({ visibility: 'visible' });
    });

    it('applies trendFontSize to the comparison container', () => {
      const { container } = render(<KpiChart value={100} trendFontSize={14} />);

      const comparisonContainer = container.querySelector('.kpiComparisonContainer');

      expect(comparisonContainer).toHaveStyle({ fontSize: '14px' });
    });
  });
});
