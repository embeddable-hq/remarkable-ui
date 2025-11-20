import { TablerIcon } from '@tabler/icons-react';
import clsx from 'clsx';
import styles from './CardFeedback.module.css';

type CardFeedbackProps = {
  className?: string;
  icon?: TablerIcon;
  title: string;
  message: string;
  variant?: 'error' | 'info';
};

export const CardFeedback: React.FC<CardFeedbackProps> = ({
  icon: Icon,
  title,
  message,
  className,
  variant = 'info',
}) => {
  return (
    <div className={clsx(styles.feedback, styles[variant], className)}>
      {Icon && <Icon />}
      <h2>{title}</h2>
      <p>{message}</p>
    </div>
  );
};
