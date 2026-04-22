import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { KpiTrend } from './KpiTrend';

describe('KpiTrend', () => {
  it('renders the value', () => {
    render(<KpiTrend value="+15%" />);

    expect(screen.getByText('+15%')).toBeInTheDocument();
  });

  it('applies positive class by default', () => {
    const { container } = render(<KpiTrend value="+15%" />);

    expect(container.firstChild).toHaveClass('positive');
  });

  it('applies negative class when reverseTrend is true', () => {
    const { container } = render(<KpiTrend value="+15%" reverseTrend />);

    expect(container.firstChild).toHaveClass('negative');
  });

  it('renders an svg icon', () => {
    const { container } = render(<KpiTrend value="+15%" />);

    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('applies additional className', () => {
    const { container } = render(<KpiTrend value="+15%" className="extra" />);

    expect(container.firstChild).toHaveClass('extra');
  });
});
