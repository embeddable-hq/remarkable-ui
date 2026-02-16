import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ButtonIcon } from './ButtonIcon';
import { MockIcon } from '../../test/MockIcon';

describe('ButtonIcon', () => {
  it('renders a button with the icon', () => {
    render(<ButtonIcon icon={MockIcon} aria-label="Action" />);

    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });

  it('applies the buttonIcon class', () => {
    render(<ButtonIcon icon={MockIcon} aria-label="Action" />);

    expect(screen.getByRole('button')).toHaveClass('buttonIcon');
  });

  it('applies the primary variant by default', () => {
    render(<ButtonIcon icon={MockIcon} aria-label="Action" />);

    expect(screen.getByRole('button')).toHaveClass('primary');
  });

  it('applies the secondary variant', () => {
    render(<ButtonIcon icon={MockIcon} variant="secondary" aria-label="Action" />);

    expect(screen.getByRole('button')).toHaveClass('secondary');
  });

  it('applies medium size by default', () => {
    render(<ButtonIcon icon={MockIcon} aria-label="Action" />);

    expect(screen.getByRole('button')).toHaveClass('medium');
  });

  it('applies small size', () => {
    render(<ButtonIcon icon={MockIcon} size="small" aria-label="Action" />);

    expect(screen.getByRole('button')).toHaveClass('small');
  });

  it('merges custom className with default classes', () => {
    render(<ButtonIcon icon={MockIcon} className="custom-class" aria-label="Action" />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('buttonIcon');
    expect(button).toHaveClass('custom-class');
  });

  it('forwards button HTML attributes', () => {
    render(<ButtonIcon icon={MockIcon} aria-label="Test button" type="submit" />);

    const button = screen.getByRole('button', { name: 'Test button' });
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<ButtonIcon icon={MockIcon} onClick={handleClick} aria-label="Action" />);
    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('supports the disabled state', () => {
    render(<ButtonIcon icon={MockIcon} disabled aria-label="Action" />);

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<ButtonIcon icon={MockIcon} onClick={handleClick} disabled aria-label="Action" />);
    await user.click(screen.getByRole('button'));

    expect(handleClick).not.toHaveBeenCalled();
  });
});
