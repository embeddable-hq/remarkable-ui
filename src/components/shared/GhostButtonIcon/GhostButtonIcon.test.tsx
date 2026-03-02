import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { GhostButtonIcon } from './GhostButtonIcon';
import { MockIcon } from '../../test/MockIcon';

describe('GhostButtonIcon', () => {
  it('renders a button with the icon', () => {
    render(<GhostButtonIcon icon={MockIcon} aria-label="Action" />);

    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument();
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });

  it('forwards button HTML attributes', () => {
    render(<GhostButtonIcon icon={MockIcon} aria-label="Test button" type="submit" />);

    const button = screen.getByRole('button', { name: 'Test button' });
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<GhostButtonIcon icon={MockIcon} onClick={handleClick} aria-label="Action" />);
    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('supports the disabled state', () => {
    render(<GhostButtonIcon icon={MockIcon} disabled aria-label="Action" />);

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<GhostButtonIcon icon={MockIcon} onClick={handleClick} disabled aria-label="Action" />);
    await user.click(screen.getByRole('button'));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('forwards ref to the button element', () => {
    const ref = vi.fn();

    render(<GhostButtonIcon ref={ref} icon={MockIcon} aria-label="Action" />);

    expect(ref).toHaveBeenCalledWith(screen.getByRole('button'));
  });
});
