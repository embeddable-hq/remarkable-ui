import {
  IconBold,
  IconCode,
  IconEye,
  IconH1,
  IconItalic,
  IconLink,
  IconList,
  IconPencil,
  IconStrikethrough,
} from '@tabler/icons-react';
import { FC, useRef, useState } from 'react';
import { Markdown } from '../Markdown/Markdown';
import styles from './MarkdownEditor.module.css';
import { GhostButtonIcon } from '../GhostButtonIcon/GhostButtonIcon';
import { applyLinePrefix, applyWrap, MAX_HISTORY } from './MarkdownEditor.utils';

type MarkdownEditorProps = {
  value?: string | null;
  onChange?: (value: string) => void;
  placeholder?: string;
};

type MarkdownEditorHistory = { entries: string[]; index: number };

export const MarkdownEditor: FC<MarkdownEditorProps> = ({
  value: valueProp,
  onChange,
  placeholder,
}) => {
  const value = valueProp ?? '';
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [history, setHistory] = useState<MarkdownEditorHistory>({ entries: [value], index: 0 });
  const [isPreview, setIsPreview] = useState(false);

  const handleChange = (newValue: string) => {
    setHistory((prev) => {
      const entries = [...prev.entries.slice(0, prev.index + 1), newValue];
      const capped = entries.length > MAX_HISTORY ? entries.slice(-MAX_HISTORY) : entries;
      return { entries: capped, index: capped.length - 1 };
    });
    onChange?.(newValue);
  };

  const applyEdit = (
    edit: (text: string, start: number, end: number) => { value: string; cursor: [number, number] },
  ) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const { selectionStart: start, selectionEnd: end } = textarea;
    const result = edit(value, start, end);
    handleChange(result.value);
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(...result.cursor);
    });
  };

  const handleWrap = (syntax: string) =>
    applyEdit((text, start, end) => ({
      value: applyWrap(text, start, end, syntax),
      cursor: [start + syntax.length, end + syntax.length],
    }));

  const handlePrefix = (prefix: string) =>
    applyEdit((text, start) => ({
      value: applyLinePrefix(text, start, prefix),
      cursor: [start + prefix.length, start + prefix.length],
    }));

  const handleLink = () =>
    applyEdit((text, start, end) => ({
      value: text.slice(0, start) + `[${text.slice(start, end)}]()` + text.slice(end),
      cursor: [end + 3, end + 3], // cursor inside the ()
    }));

  const navigate = (delta: -1 | 1) => {
    const newIndex = history.index + delta;
    if (newIndex < 0 || newIndex >= history.entries.length) return;
    const entry = history.entries[newIndex];
    if (entry === undefined) return;
    setHistory((prev) => ({ ...prev, index: newIndex }));
    onChange?.(entry);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!e.ctrlKey && !e.metaKey) return;
    const key = `${e.shiftKey ? 'shift+' : ''}${e.key.toLowerCase()}`;
    const actions: Record<string, () => void> = {
      z: () => navigate(-1),
      'shift+z': () => navigate(1),
      y: () => navigate(1),
      b: () => handleWrap('**'),
      i: () => handleWrap('*'),
      k: handleLink,
      '`': () => handleWrap('`'),
      'shift+x': () => handleWrap('~~'),
    };
    const action = actions[key];
    if (action) {
      e.preventDefault();
      action();
    }
  };

  const toolbarButtons = [
    { icon: IconBold, label: 'Bold', onClick: () => handleWrap('**') },
    { icon: IconItalic, label: 'Italic', onClick: () => handleWrap('*') },
    { icon: IconStrikethrough, label: 'Strikethrough', onClick: () => handleWrap('~~') },
    { icon: IconCode, label: 'Code', onClick: () => handleWrap('`') },
    { icon: IconH1, label: 'Heading', onClick: () => handlePrefix('# ') },
    { icon: IconList, label: 'Bullet list', onClick: () => handlePrefix('- ') },
    { icon: IconLink, label: 'Link', onClick: handleLink },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        {toolbarButtons.map(({ icon, label, onClick }) => (
          <GhostButtonIcon
            key={label}
            icon={icon}
            aria-label={label}
            disabled={isPreview}
            onMouseDown={(e) => e.preventDefault()}
            onClick={onClick}
          />
        ))}
        <div className={styles.toolbarSpacer} />
        <GhostButtonIcon
          icon={isPreview ? IconPencil : IconEye}
          aria-label={isPreview ? 'Edit' : 'Preview'}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => setIsPreview((prev) => !prev)}
        />
      </div>
      {isPreview ? (
        <div className={styles.preview}>
          <Markdown content={value} />
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          className={styles.markdownEditor}
          value={value}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
      )}
    </div>
  );
};
