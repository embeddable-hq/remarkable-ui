import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Dropdown } from './Dropdown';

describe('Dropdown', () => {
  it('renders the trigger component', () => {
    render(
      <Dropdown triggerComponent={<button>Open menu</button>}>
        <div>Menu content</div>
      </Dropdown>,
    );

    expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument();
  });

  it('does not show content by default', () => {
    render(
      <Dropdown triggerComponent={<button>Open menu</button>}>
        <div>Menu content</div>
      </Dropdown>,
    );

    expect(screen.queryByText('Menu content')).not.toBeInTheDocument();
  });

  it('shows content when trigger is clicked', async () => {
    const user = userEvent.setup();

    render(
      <Dropdown triggerComponent={<button>Open menu</button>}>
        <div>Menu content</div>
      </Dropdown>,
    );

    await user.click(screen.getByRole('button', { name: 'Open menu' }));

    expect(screen.getByText('Menu content')).toBeInTheDocument();
  });

  it('does not open when disabled', async () => {
    const user = userEvent.setup();

    render(
      <Dropdown triggerComponent={<button>Open menu</button>} disabled>
        <div>Menu content</div>
      </Dropdown>,
    );

    await user.click(screen.getByRole('button', { name: 'Open menu' }));

    expect(screen.queryByText('Menu content')).not.toBeInTheDocument();
  });

  it('renders content when open is true (controlled)', () => {
    render(
      <Dropdown triggerComponent={<button>Open menu</button>} open={true}>
        <div>Menu content</div>
      </Dropdown>,
    );

    expect(screen.getByText('Menu content')).toBeInTheDocument();
  });

  it('does not render content when open is false (controlled)', () => {
    render(
      <Dropdown triggerComponent={<button>Open menu</button>} open={false}>
        <div>Menu content</div>
      </Dropdown>,
    );

    expect(screen.queryByText('Menu content')).not.toBeInTheDocument();
  });

  it('calls onOpenChange when toggled', async () => {
    const user = userEvent.setup();
    const handleOpenChange = vi.fn();

    render(
      <Dropdown triggerComponent={<button>Open menu</button>} onOpenChange={handleOpenChange}>
        <div>Menu content</div>
      </Dropdown>,
    );

    await user.click(screen.getByRole('button', { name: 'Open menu' }));

    expect(handleOpenChange).toHaveBeenCalledWith(true);
  });

  it('renders multiple children', async () => {
    const user = userEvent.setup();

    render(
      <Dropdown triggerComponent={<button>Open menu</button>}>
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </Dropdown>,
    );

    await user.click(screen.getByRole('button', { name: 'Open menu' }));

    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
    expect(screen.getByText('Item 3')).toBeInTheDocument();
  });
});
