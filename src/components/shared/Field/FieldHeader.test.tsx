import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { FieldHeader } from './FieldHeader';

describe('FieldHeader', () => {
  it('renders the label', () => {
    render(<FieldHeader label="Username" />);

    expect(screen.getByText('Username')).toBeInTheDocument();
  });

  it('renders as a label element', () => {
    render(<FieldHeader label="Username" />);

    expect(screen.getByText('Username').tagName).toBe('LABEL');
  });

  it('applies the fieldHeader class', () => {
    render(<FieldHeader label="Username" />);

    expect(screen.getByText('Username')).toHaveClass('fieldHeader');
  });

  it('renders the required indicator when required is true', () => {
    render(<FieldHeader label="Username" required />);

    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('does not render the required indicator by default', () => {
    render(<FieldHeader label="Username" />);

    expect(screen.queryByText('Required')).not.toBeInTheDocument();
  });

  it('renders a custom required label', () => {
    render(<FieldHeader label="Username" required requiredLabel="Mandatory" />);

    expect(screen.getByText('Mandatory')).toBeInTheDocument();
    expect(screen.queryByText('Required')).not.toBeInTheDocument();
  });

  it('renders when only required is true and no label is provided', () => {
    render(<FieldHeader required />);

    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('returns null when neither label nor required is provided', () => {
    const { container } = render(<FieldHeader />);

    expect(container).toBeEmptyDOMElement();
  });

  it('merges custom className', () => {
    render(<FieldHeader label="Username" className="custom-class" />);

    const element = screen.getByText('Username');
    expect(element).toHaveClass('fieldHeader');
    expect(element).toHaveClass('custom-class');
  });
});
