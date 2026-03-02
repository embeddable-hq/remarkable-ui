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

type MarkdownEditorProps = {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
};

function applyWrap(value: string, start: number, end: number, syntax: string): string {
  return value.slice(0, start) + syntax + value.slice(start, end) + syntax + value.slice(end);
}

function applyLinePrefix(value: string, start: number, prefix: string): string {
  const lineStart = value.lastIndexOf('\n', start - 1) + 1;
  return value.slice(0, lineStart) + prefix + value.slice(lineStart);
}

type HistoryState = { entries: string[]; index: number };

export const MarkdownEditor: FC<MarkdownEditorProps> = ({ value = '', onChange, placeholder }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isUndoRedoRef = useRef(false);
  const [history, setHistory] = useState<HistoryState>({ entries: [value], index: 0 });
  const [isPreview, setIsPreview] = useState(false);

  const handleChange = (newValue: string) => {
    if (!isUndoRedoRef.current) {
      setHistory((prev) => ({
        entries: [...prev.entries.slice(0, prev.index + 1), newValue],
        index: prev.index + 1,
      }));
    }
    isUndoRedoRef.current = false;
    onChange?.(newValue);
  };

  const handleWrap = (syntax: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart: start, selectionEnd: end } = textarea;
    handleChange(applyWrap(value, start, end, syntax));

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + syntax.length, end + syntax.length);
    });
  };

  const handlePrefix = (prefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart: start } = textarea;
    handleChange(applyLinePrefix(value, start, prefix));

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length);
    });
  };

  const handleLink = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart: start, selectionEnd: end } = textarea;
    const selected = value.slice(start, end);
    const insertion = `[${selected}]()`;
    handleChange(value.slice(0, start) + insertion + value.slice(end));

    // place cursor inside the () ready to type the URL
    const urlPos = start + 1 + selected.length + 2;
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(urlPos, urlPos);
    });
  };

  const handleUndo = () => {
    if (history.index <= 0) return;
    const newIndex = history.index - 1;
    const entry = history.entries[newIndex];
    if (entry === undefined) return;
    isUndoRedoRef.current = true;
    setHistory((prev) => ({ ...prev, index: newIndex }));
    onChange?.(entry);
  };

  const handleRedo = () => {
    if (history.index >= history.entries.length - 1) return;
    const newIndex = history.index + 1;
    const entry = history.entries[newIndex];
    if (entry === undefined) return;
    isUndoRedoRef.current = true;
    setHistory((prev) => ({ ...prev, index: newIndex }));
    onChange?.(entry);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const isMod = e.ctrlKey || e.metaKey;
    if (isMod && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      handleUndo();
    } else if (isMod && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
      e.preventDefault();
      handleRedo();
    }
  };

  const formatItems = [
    { icon: IconBold, label: 'Bold', action: () => handleWrap('**') },
    { icon: IconItalic, label: 'Italic', action: () => handleWrap('*') },
    { icon: IconStrikethrough, label: 'Strikethrough', action: () => handleWrap('~~') },
    { icon: IconCode, label: 'Code', action: () => handleWrap('`') },
    { icon: IconH1, label: 'Heading', action: () => handlePrefix('# ') },
    { icon: IconList, label: 'Bullet list', action: () => handlePrefix('- ') },
    { icon: IconLink, label: 'Link', action: handleLink },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.toolbar}>
        {formatItems.map(({ icon, label, action }) => (
          <GhostButtonIcon
            key={label}
            icon={icon}
            aria-label={label}
            disabled={isPreview}
            onMouseDown={(e) => e.preventDefault()}
            onClick={action}
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
