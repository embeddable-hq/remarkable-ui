import { FC, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import styles from './Markdown.module.css';

type MarkdownProps = {
  content?: string;
};

const normalizeEscapedNewlines = (input?: string) => input?.replaceAll(String.raw`\n`, '\n');

export const Markdown: FC<MarkdownProps> = ({ content }) => {
  const resolvedContent = useMemo(() => {
    return normalizeEscapedNewlines(content);
  }, [content]);

  return (
    <div className={styles.markdown}>
      {/* // rehype-raw is intentionally omitted: raw HTML in content is escaped, not rendered */}
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{resolvedContent}</ReactMarkdown>
    </div>
  );
};
