import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Markdown } from './Markdown';

describe('Markdown', () => {
  describe('rendering', () => {
    it('renders without crashing when content is undefined', () => {
      const { container } = render(<Markdown />);

      expect(container.firstChild).toBeInTheDocument();
    });

    it('applies the markdown class to the wrapper', () => {
      const { container } = render(<Markdown content="Hello" />);

      expect(container.firstChild).toHaveClass('markdown');
    });

    it('renders plain text', () => {
      render(<Markdown content="Hello world" />);

      expect(screen.getByText('Hello world')).toBeInTheDocument();
    });
  });

  describe('markdown elements', () => {
    it('renders h1 heading', () => {
      render(<Markdown content="# Heading 1" />);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Heading 1');
    });

    it('renders h2 heading', () => {
      render(<Markdown content="## Heading 2" />);

      expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Heading 2');
    });

    it('renders h3 heading', () => {
      render(<Markdown content="### Heading 3" />);

      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Heading 3');
    });

    it('renders bold text as <strong>', () => {
      render(<Markdown content="**bold**" />);

      expect(screen.getByText('bold').tagName).toBe('STRONG');
    });

    it('renders italic text as <em>', () => {
      render(<Markdown content="_italic_" />);

      expect(screen.getByText('italic').tagName).toBe('EM');
    });

    it('renders inline code as <code>', () => {
      render(<Markdown content="`code`" />);

      expect(screen.getByText('code').tagName).toBe('CODE');
    });

    it('renders a link with correct href', () => {
      render(<Markdown content="[label](https://example.com)" />);

      expect(screen.getByRole('link', { name: 'label' })).toHaveAttribute(
        'href',
        'https://example.com',
      );
    });

    it('renders an unordered list', () => {
      render(<Markdown content={'- Item 1\n- Item 2'} />);

      expect(screen.getByRole('list')).toBeInTheDocument();
      expect(screen.getAllByRole('listitem')).toHaveLength(2);
    });

    it('renders strikethrough text (GFM)', () => {
      render(<Markdown content="~~strikethrough~~" />);

      expect(screen.getByText('strikethrough').tagName).toBe('DEL');
    });
  });

  describe('escaped newline normalization', () => {
    it('converts literal \\n sequences to actual newlines', () => {
      render(<Markdown content={'# Title\\n\\nParagraph text'} />);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Title');
      expect(screen.getByText('Paragraph text')).toBeInTheDocument();
    });

    it('renders correctly without any escaped newlines', () => {
      render(<Markdown content={'# Title\n\nParagraph text'} />);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Title');
      expect(screen.getByText('Paragraph text')).toBeInTheDocument();
    });
  });
});
