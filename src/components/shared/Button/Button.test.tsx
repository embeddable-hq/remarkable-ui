import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconProps } from '@tabler/icons-react';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';
import { MockIcon } from '../../test/MockIcon';

describe('Button', () => {
  it('renders a button with text', () => {
    render(<Button>Click me</Button>);

    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('applies the button class', () => {
    render(<Button>Click me</Button>);

    expect(screen.getByRole('button')).toHaveClass('button');
  });

  it('applies the primary variant by default', () => {
    render(<Button>Click me</Button>);

    expect(screen.getByRole('button')).toHaveClass('primary');
  });

  it('applies the secondary variant', () => {
    render(<Button variant="secondary">Click me</Button>);

    expect(screen.getByRole('button')).toHaveClass('secondary');
  });

  it('applies medium size by default', () => {
    render(<Button>Click me</Button>);

    expect(screen.getByRole('button')).toHaveClass('medium');
  });

  it('applies small size', () => {
    render(<Button size="small">Click me</Button>);

    expect(screen.getByRole('button')).toHaveClass('small');
  });

  it('merges custom className with default classes', () => {
    render(<Button className="custom-class">Click me</Button>);

    const button = screen.getByRole('button');
    expect(button).toHaveClass('button');
    expect(button).toHaveClass('custom-class');
  });

  it('renders a start icon', () => {
    render(<Button startIcon={MockIcon}>Click me</Button>);

    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });

  it('renders an end icon', () => {
    render(<Button endIcon={MockIcon}>Click me</Button>);

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
      <Button startIcon={StartIcon} endIcon={EndIcon}>
        Click me
      </Button>,
    );

    expect(screen.getByTestId('start-icon')).toBeInTheDocument();
    expect(screen.getByTestId('end-icon')).toBeInTheDocument();
  });

  it('does not render icons when none are provided', () => {
    render(<Button>Click me</Button>);

    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    expect(screen.getByRole('button').querySelectorAll('svg')).toHaveLength(0);
  });

  it('forwards button HTML attributes', () => {
    render(
      <Button aria-label="Test button" type="submit">
        Click me
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Test button' });
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Click me</Button>);
    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('supports the disabled state', () => {
    render(<Button disabled>Click me</Button>);

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Button onClick={handleClick} disabled>
        Click me
      </Button>,
    );
    await user.click(screen.getByRole('button'));

    expect(handleClick).not.toHaveBeenCalled();
  });
});
