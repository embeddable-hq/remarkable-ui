import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { ActionIcon } from './ActionIcon';
import { MockIcon } from '../../test/MockIcon';

describe('ActionIcon', () => {
  it('renders a button with the icon', () => {
    render(<ActionIcon icon={MockIcon} />);

    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });

  it('applies the actionIcon class to the button', () => {
    render(<ActionIcon icon={MockIcon} />);

    expect(screen.getByRole('button')).toHaveClass('actionIcon');
  });

  it('applies the icon class to the icon', () => {
    render(<ActionIcon icon={MockIcon} />);

    expect(screen.getByTestId('mock-icon')).toHaveClass('icon');
  });

  it('merges custom className with default class', () => {
    render(<ActionIcon icon={MockIcon} className="custom-class" />);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('actionIcon');
    expect(button).toHaveClass('custom-class');
  });

  it('forwards button HTML attributes', () => {
    render(<ActionIcon icon={MockIcon} aria-label="Test action" type="submit" />);

    const button = screen.getByRole('button', { name: 'Test action' });
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<ActionIcon icon={MockIcon} onClick={handleClick} />);
    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('supports the disabled state', () => {
    render(<ActionIcon icon={MockIcon} disabled />);

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<ActionIcon icon={MockIcon} onClick={handleClick} disabled />);
    await user.click(screen.getByRole('button'));

    expect(handleClick).not.toHaveBeenCalled();
  });
});
