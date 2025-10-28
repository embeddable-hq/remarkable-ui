import React from 'react';
import styles from '../../../../remarkable-ui/shared/Card/Card.module.css';

type Props = {
  title?: string;
  body?: string;
};

export const TextComponent: React.FC<Props> = ({ title, body }) => {
  return (
    <div className={styles.header}>
      <div>
        <h1 className={styles.title}>{title}</h1>
        <p className={styles.subtitle}>{body}</p>
      </div>
    </div>
  );
};

export default TextComponent;
