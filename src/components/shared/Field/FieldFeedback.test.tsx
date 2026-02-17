import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FieldFeedback } from './FieldFeedback';

describe('FieldFeedback', () => {
  it('renders the message', () => {
    render(<FieldFeedback message="Helper text" />);

    expect(screen.getByText('Helper text')).toBeInTheDocument();
  });

  it('renders as a paragraph element', () => {
    render(<FieldFeedback message="Helper text" />);

    expect(screen.getByText('Helper text').tagName).toBe('P');
  });

  it('applies the fieldFeedback class', () => {
    render(<FieldFeedback message="Helper text" />);

    expect(screen.getByText('Helper text')).toHaveClass('fieldFeedback');
  });

  it('applies the error class when variant is error', () => {
    render(<FieldFeedback message="Something went wrong" variant="error" />);

    expect(screen.getByText('Something went wrong')).toHaveClass('error');
  });

  it('does not apply the error class by default', () => {
    render(<FieldFeedback message="Helper text" />);

    expect(screen.getByText('Helper text')).not.toHaveClass('error');
  });

  it('merges custom className', () => {
    render(<FieldFeedback message="Helper text" className="custom-class" />);

    const element = screen.getByText('Helper text');
    expect(element).toHaveClass('fieldFeedback');
    expect(element).toHaveClass('custom-class');
  });
});
