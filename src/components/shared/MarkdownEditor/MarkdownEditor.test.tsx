import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { MarkdownEditor } from './MarkdownEditor';

describe('MarkdownEditor', () => {
  describe('rendering', () => {
    it('renders without crashing when value is undefined', () => {
      const { container } = render(<MarkdownEditor />);

      expect(container.firstChild).toBeInTheDocument();
    });

    it('renders a textarea element', () => {
      render(<MarkdownEditor />);

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('displays the provided value', () => {
      render(<MarkdownEditor value="# Hello" onChange={() => {}} />);

      expect(screen.getByRole('textbox')).toHaveValue('# Hello');
    });

    it('displays the placeholder', () => {
      render(<MarkdownEditor placeholder="Enter markdown..." />);

      expect(screen.getByPlaceholderText('Enter markdown...')).toBeInTheDocument();
    });

    it('shows all toolbar buttons', () => {
      render(<MarkdownEditor />);

      expect(screen.getByRole('button', { name: 'Bold' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Italic' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Strikethrough' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Code' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Heading' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Bullet list' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Link' })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Preview' })).toBeInTheDocument();
    });
  });

  describe('preview toggle', () => {
    it('shows the textarea by default', () => {
      render(<MarkdownEditor value="hello" />);

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });

    it('hides the textarea and shows preview when Preview is clicked', async () => {
      render(<MarkdownEditor value="hello" />);

      await userEvent.click(screen.getByRole('button', { name: 'Preview' }));

      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    });

    it('disables format buttons in preview mode', async () => {
      render(<MarkdownEditor value="hello" />);

      await userEvent.click(screen.getByRole('button', { name: 'Preview' }));

      expect(screen.getByRole('button', { name: 'Bold' })).toBeDisabled();
    });

    it('returns to the textarea when Edit is clicked', async () => {
      render(<MarkdownEditor value="hello" />);

      await userEvent.click(screen.getByRole('button', { name: 'Preview' }));
      await userEvent.click(screen.getByRole('button', { name: 'Edit' }));

      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
  });

  describe('interaction', () => {
    it('calls onChange with the new value when typing', async () => {
      const onChange = vi.fn();
      render(<MarkdownEditor value="" onChange={onChange} />);

      await userEvent.type(screen.getByRole('textbox'), 'hello');

      expect(onChange).toHaveBeenCalledWith('h');
    });

    it('does not throw when onChange is not provided', async () => {
      render(<MarkdownEditor value="" />);

      await userEvent.type(screen.getByRole('textbox'), 'hello');
    });
  });

  describe('toolbar formatting', () => {
    it('wraps selected text with ** when Bold is clicked', async () => {
      const onChange = vi.fn();
      render(<MarkdownEditor value="hello" onChange={onChange} />);
      selectAll('hello');

      await userEvent.click(screen.getByRole('button', { name: 'Bold' }));

      expect(onChange).toHaveBeenCalledWith('**hello**');
    });

    it('wraps selected text with * when Italic is clicked', async () => {
      const onChange = vi.fn();
      render(<MarkdownEditor value="hello" onChange={onChange} />);
      selectAll('hello');

      await userEvent.click(screen.getByRole('button', { name: 'Italic' }));

      expect(onChange).toHaveBeenCalledWith('*hello*');
    });

    it('wraps selected text with ~~ when Strikethrough is clicked', async () => {
      const onChange = vi.fn();
      render(<MarkdownEditor value="hello" onChange={onChange} />);
      selectAll('hello');

      await userEvent.click(screen.getByRole('button', { name: 'Strikethrough' }));

      expect(onChange).toHaveBeenCalledWith('~~hello~~');
    });

    it('wraps selected text with ` when Code is clicked', async () => {
      const onChange = vi.fn();
      render(<MarkdownEditor value="hello" onChange={onChange} />);
      selectAll('hello');

      await userEvent.click(screen.getByRole('button', { name: 'Code' }));

      expect(onChange).toHaveBeenCalledWith('`hello`');
    });

    it('prefixes current line with # when Heading is clicked', async () => {
      const onChange = vi.fn();
      render(<MarkdownEditor value="hello" onChange={onChange} />);
      selectAll('hello');

      await userEvent.click(screen.getByRole('button', { name: 'Heading' }));

      expect(onChange).toHaveBeenCalledWith('# hello');
    });

    it('prefixes current line with - when Bullet list is clicked', async () => {
      const onChange = vi.fn();
      render(<MarkdownEditor value="hello" onChange={onChange} />);
      selectAll('hello');

      await userEvent.click(screen.getByRole('button', { name: 'Bullet list' }));

      expect(onChange).toHaveBeenCalledWith('- hello');
    });

    it('wraps selected text as link label when Link is clicked', async () => {
      const onChange = vi.fn();
      render(<MarkdownEditor value="hello" onChange={onChange} />);
      selectAll('hello');

      await userEvent.click(screen.getByRole('button', { name: 'Link' }));

      expect(onChange).toHaveBeenCalledWith('[hello]()');
    });
  });

  describe('undo/redo', () => {
    it('undoes a change via Ctrl+Z', async () => {
      const onChange = vi.fn();
      render(<MarkdownEditor value="hello" onChange={onChange} />);
      selectAll('hello');

      await userEvent.click(screen.getByRole('button', { name: 'Bold' }));
      fireEvent.keyDown(screen.getByRole('textbox'), { key: 'z', ctrlKey: true });

      expect(onChange).toHaveBeenLastCalledWith('hello');
    });

    it('redoes a change via Ctrl+Y', async () => {
      const onChange = vi.fn();
      render(<MarkdownEditor value="hello" onChange={onChange} />);
      selectAll('hello');

      await userEvent.click(screen.getByRole('button', { name: 'Bold' }));
      fireEvent.keyDown(screen.getByRole('textbox'), { key: 'z', ctrlKey: true });
      fireEvent.keyDown(screen.getByRole('textbox'), { key: 'y', ctrlKey: true });

      expect(onChange).toHaveBeenLastCalledWith('**hello**');
    });

    it('redoes a change via Ctrl+Shift+Z', async () => {
      const onChange = vi.fn();
      render(<MarkdownEditor value="hello" onChange={onChange} />);
      selectAll('hello');

      await userEvent.click(screen.getByRole('button', { name: 'Bold' }));
      fireEvent.keyDown(screen.getByRole('textbox'), { key: 'z', ctrlKey: true });
      fireEvent.keyDown(screen.getByRole('textbox'), { key: 'z', ctrlKey: true, shiftKey: true });

      expect(onChange).toHaveBeenLastCalledWith('**hello**');
    });
  });
});

// shared helper used in toolbar and undo/redo tests
function selectAll(value: string) {
  const textarea = screen.getByRole<HTMLTextAreaElement>('textbox');
  textarea.setSelectionRange(0, value.length);
}
