import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProps } from '@tabler/icons-react';
import { describe, expect, it, vi } from 'vitest';
import { GhostButton } from './GhostButton';
import { MockIcon } from '../../test/MockIcon';

describe('GhostButton', () => {
  it('renders a button with text', () => {
    render(<GhostButton>Click me</GhostButton>);

    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('applies the ghostButton class', () => {
    render(<GhostButton>Click me</GhostButton>);

    expect(screen.getByRole('button')).toHaveClass('ghostButton');
  });

  it('merges custom className with default classes', () => {
    render(<GhostButton className="custom-class">Click me</GhostButton>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('ghostButton');
    expect(button).toHaveClass('custom-class');
  });

  it('renders a start icon', () => {
    render(<GhostButton startIcon={MockIcon}>Click me</GhostButton>);

    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });

  it('renders an end icon', () => {
    render(<GhostButton endIcon={MockIcon}>Click me</GhostButton>);

    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });

  it('renders both start and end icons', () => {
    const StartIcon = (props: IconProps) => {
      return <MockIcon data-testid="start-icon" {...props} />;
    };
    const EndIcon = (props: IconProps) => {
      return <MockIcon data-testid="end-icon" {...props} />;
    };

    render(
      <GhostButton startIcon={StartIcon} endIcon={EndIcon}>
        Click me
      </GhostButton>,
    );

    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
  });

  it('does not render icons when none are provided', () => {
    render(<GhostButton>Click me</GhostButton>);

    expect(screen.getByRole('button').querySelectorAll('svg')).toHaveLength(0);
  });

  it('forwards button HTML attributes', () => {
    render(
      <GhostButton aria-label="Test button" type="submit">
        Click me
      </GhostButton>,
    );

    const button = screen.getByRole('button', { name: 'Test button' });
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<GhostButton onClick={handleClick}>Click me</GhostButton>);
    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('supports the disabled state', () => {
    render(<GhostButton disabled>Click me</GhostButton>);

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <GhostButton onClick={handleClick} disabled>
        Click me
      </GhostButton>,
    );
    await user.click(screen.getByRole('button'));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('wraps children in a span', () => {
    render(<GhostButton>Click me</GhostButton>);

    const span = screen.getByRole('button').querySelector('span');
    expect(span).toHaveTextContent('Click me');
  });

  it('forwards ref to the button element', () => {
    const ref = vi.fn();

    render(<GhostButton ref={ref}>Click me</GhostButton>);

    expect(ref).toHaveBeenCalledWith(screen.getByRole('button'));
  });
});
