import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  it('renders the trigger', () => {
    render(<Tooltip trigger={<button>Hover me</button>}>Tooltip content</Tooltip>);

    expect(screen.getByRole('button', { name: 'Hover me' })).toBeInTheDocument();
  });

  it('does not show content by default', () => {
    render(<Tooltip trigger={<button>Hover me</button>}>Tooltip content</Tooltip>);

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows content on hover', async () => {
    const user = userEvent.setup();

    render(<Tooltip trigger={<button>Hover me</button>}>Tooltip content</Tooltip>);

    await user.hover(screen.getByRole('button', { name: 'Hover me' }));

    expect(await screen.findByRole('tooltip')).toHaveTextContent('Tooltip content');
  });

  it('creates the overlay container in the document', async () => {
    const user = userEvent.setup();

    render(<Tooltip trigger={<button>Hover me</button>}>Tooltip content</Tooltip>);

    await user.hover(screen.getByRole('button', { name: 'Hover me' }));
    await screen.findByRole('tooltip');

    expect(document.querySelector('[embeddable-radix-overlays]')).toBeInTheDocument();
  });

  it('renders with custom side and align', async () => {
    const user = userEvent.setup();

    render(
      <Tooltip trigger={<button>Hover me</button>} side="bottom" align="start">
        Tooltip content
      </Tooltip>,
    );

    await user.hover(screen.getByRole('button', { name: 'Hover me' }));

    const tooltip = await screen.findByRole('tooltip');
    const content = tooltip.closest('[data-side]');
    expect(content).toHaveAttribute('data-side', 'bottom');
    expect(content).toHaveAttribute('data-align', 'start');
  });
});
