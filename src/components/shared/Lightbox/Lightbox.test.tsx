import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Lightbox } from './Lightbox';

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

describe('Lightbox', () => {
  it('opens as a modal dialog and renders children', () => {
    const { container } = render(
      <Lightbox open onClose={vi.fn()}>
        Content
      </Lightbox>,
    );

    expect(getDialog(container).open).toBe(true);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies the lightbox class and merges a custom className', () => {
    const { container } = render(
      <Lightbox open onClose={vi.fn()} className="custom-class">
        Content
      </Lightbox>,
    );

    const dialog = getDialog(container);
    expect(dialog).toHaveClass('lightbox');
    expect(dialog).toHaveClass('custom-class');
  });

  it('sets the accessible name from ariaLabel', () => {
    const { container } = render(
      <Lightbox open onClose={vi.fn()} ariaLabel="My lightbox">
        Content
      </Lightbox>,
    );

    expect(getDialog(container)).toHaveAttribute('aria-label', 'My lightbox');
  });

  it('calls onClose when the dialog closes', () => {
    const onClose = vi.fn();
    const { container } = render(
      <Lightbox open onClose={onClose}>
        Content
      </Lightbox>,
    );

    getDialog(container).close();

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes on Escape', () => {
    const onClose = vi.fn();
    const { container } = render(
      <Lightbox open onClose={onClose}>
        Content
      </Lightbox>,
    );

    fireEvent.keyDown(getDialog(container), { key: 'Escape' });

    expect(getDialog(container).open).toBe(false);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('closes when a click starts and ends on the backdrop', () => {
    const onClose = vi.fn();
    const { container } = render(
      <Lightbox open onClose={onClose}>
        Content
      </Lightbox>,
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
      <Lightbox open onClose={onClose}>
        <span>Content</span>
      </Lightbox>,
    );

    const dialog = getDialog(container);
    fireEvent.mouseDown(screen.getByText('Content'));
    fireEvent.click(dialog);

    expect(dialog.open).toBe(true);
    expect(onClose).not.toHaveBeenCalled();
  });

  it('locks body scroll while open and restores it on close', () => {
    const { unmount } = render(
      <Lightbox open onClose={vi.fn()}>
        Content
      </Lightbox>,
    );

    expect(document.body.style.overflow).toBe('hidden');

    unmount();

    expect(document.body.style.overflow).toBe('');
  });

  it('closes the dialog when unmounted while open', () => {
    const { container, unmount } = render(
      <Lightbox open onClose={vi.fn()}>
        Content
      </Lightbox>,
    );

    const dialog = getDialog(container);
    expect(dialog.open).toBe(true);

    unmount();

    expect(dialog.open).toBe(false);
  });
});
