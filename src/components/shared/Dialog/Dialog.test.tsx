import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { StrictMode } from 'react';
import { Dialog } from './Dialog';

// jsdom does not implement the dialog API (show/showModal/close).
if (!HTMLDialogElement.prototype.showModal) {
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    this.open = true;
  };
  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    if (!this.open) return;
    this.open = false;
    this.dispatchEvent(new Event('close'));
  };
}

const getDialog = (container: HTMLElement) => container.querySelector('dialog')!;

describe('Dialog', () => {
  it('opens as a modal dialog and renders children', () => {
    const { container } = render(
      <Dialog open onClose={vi.fn()}>
        Content
      </Dialog>,
    );

    expect(getDialog(container).open).toBe(true);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies the dialog class and merges a custom className', () => {
    const { container } = render(
      <Dialog open onClose={vi.fn()} className="custom-class">
        Content
      </Dialog>,
    );

    const dialog = getDialog(container);
    expect(dialog).toHaveClass('dialog');
    expect(dialog).toHaveClass('custom-class');
  });

  it('sets the accessible name from ariaLabel', () => {
    const { container } = render(
      <Dialog open onClose={vi.fn()} ariaLabel="My dialog">
        Content
      </Dialog>,
    );

    expect(getDialog(container)).toHaveAttribute('aria-label', 'My dialog');
  });

  it('calls onClose when the dialog closes', () => {
    const onClose = vi.fn();
    const { container } = render(
      <Dialog open onClose={onClose}>
        Content
      </Dialog>,
    );

    getDialog(container).close();

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes on Escape', () => {
    const onClose = vi.fn();
    const { container } = render(
      <Dialog open onClose={onClose}>
        Content
      </Dialog>,
    );

    fireEvent.keyDown(getDialog(container), { key: 'Escape' });

    expect(getDialog(container).open).toBe(false);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes when a click starts and ends on the backdrop', () => {
    const onClose = vi.fn();
    const { container } = render(
      <Dialog open onClose={onClose}>
        Content
      </Dialog>,
    );

    const dialog = getDialog(container);
    fireEvent.mouseDown(dialog);
    fireEvent.click(dialog);

    expect(dialog.open).toBe(false);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when a drag starts inside the content and ends on the backdrop', () => {
    const onClose = vi.fn();
    const { container } = render(
      <Dialog open onClose={onClose}>
        <span>Content</span>
      </Dialog>,
    );

    const dialog = getDialog(container);
    fireEvent.mouseDown(screen.getByText('Content'));
    fireEvent.click(dialog);

    expect(dialog.open).toBe(true);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('locks body scroll while open and restores it on close', () => {
    const { unmount } = render(
      <Dialog open onClose={vi.fn()}>
        Content
      </Dialog>,
    );

    expect(document.body.style.overflow).toBe('hidden');

    unmount();

    expect(document.body.style.overflow).toBe('');
  });

  it('keeps body scroll locked until the last open dialog closes', () => {
    const first = render(
      <Dialog open onClose={vi.fn()}>
        One
      </Dialog>,
    );
    const second = render(
      <Dialog open onClose={vi.fn()}>
        Two
      </Dialog>,
    );

    expect(document.body.style.overflow).toBe('hidden');

    first.unmount();
    expect(document.body.style.overflow).toBe('hidden');

    second.unmount();
    expect(document.body.style.overflow).toBe('');
  });

  it('closes the dialog without calling onClose when unmounted while open', () => {
    const onClose = vi.fn();
    const { container, unmount } = render(
      <Dialog open onClose={onClose}>
        Content
      </Dialog>,
    );

    const dialog = getDialog(container);
    expect(dialog.open).toBe(true);

    unmount();

    expect(dialog.open).toBe(false);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('focuses the dialog itself on open, not the first focusable child', () => {
    const { container } = render(
      <Dialog open onClose={vi.fn()}>
        <button>Info</button>
      </Dialog>,
    );

    expect(document.activeElement).toBe(getDialog(container));
    expect(document.activeElement).not.toBe(screen.getByRole('button', { name: 'Info' }));
  });

  it('does not call onClose for lifecycle closes during Strict Mode effect replay', () => {
    const onClose = vi.fn();
    const { container } = render(
      <StrictMode>
        <Dialog open onClose={onClose}>
          Content
        </Dialog>
      </StrictMode>,
    );

    expect(getDialog(container).open).toBe(true);
    expect(onClose).not.toHaveBeenCalled();
  });
});
