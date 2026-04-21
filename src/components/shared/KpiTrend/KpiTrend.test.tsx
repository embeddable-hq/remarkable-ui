import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { KpiTrend } from './KpiTrend';

describe('KpiTrend', () => {
  it('renders the value', () => {
    render(<KpiTrend direction="positive" value="+15%" />);

    expect(screen.getByText('+15%')).toBeInTheDocument();
  });

  it('applies positive class for positive direction', () => {
    const { container } = render(<KpiTrend direction="positive" value="+15%" />);

    expect(container.firstChild).toHaveClass('positive');
  });

  it('applies negative class for negative direction', () => {
    const { container } = render(<KpiTrend direction="negative" value="-10%" />);

    expect(container.firstChild).toHaveClass('negative');
  });

  it('renders trending up icon for positive direction', () => {
    const { container } = render(<KpiTrend direction="positive" value="+15%" />);

    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders trending down icon for negative direction', () => {
    const { container } = render(<KpiTrend direction="negative" value="-10%" />);

    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('applies additional className', () => {
    const { container } = render(<KpiTrend direction="positive" value="+15%" className="extra" />);

    expect(container.firstChild).toHaveClass('extra');
  });
});
