import React from 'react';
import styles from './Card.module.css';
import clsx from 'clsx';
import { IconInfoCircle } from '@tabler/icons-react';
import { Tooltip } from '../Tooltip/Tooltip';

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div className={clsx(styles.card, className)} ref={ref} {...props}>
        {children}
      </div>
    );
  },
);

Card.displayName = 'Card';

type CardHeaderProps = {
  title?: string;
  subtitle?: string;
  tooltip?: React.ReactNode;
};

const LONG_TOOLTIP_TEXT_LENGTH = 15;

const getTooltipText = (tooltip: React.ReactNode): string => {
  if (typeof tooltip === 'string' || typeof tooltip === 'number') {
    return String(tooltip);
  }

  if (Array.isArray(tooltip)) {
    return tooltip.map(getTooltipText).join('');
  }

  return '';
};

const getCardHeaderTooltipAlign = (
  tooltip: React.ReactNode,
): React.ComponentProps<typeof Tooltip>['align'] => {
  const tooltipText = getTooltipText(tooltip).trim();

  return tooltipText.length > LONG_TOOLTIP_TEXT_LENGTH ? 'end' : 'center';
};

export const CardHeader: React.FC<CardHeaderProps> = ({ title, subtitle, tooltip }) => {
  if (!title && !subtitle && !tooltip) {
    return null;
  }

  return (
    <div className={styles.cardHeader}>
      <div className={styles.cardHeaderTitle}>
        {title && <h1>{title}</h1>}
        {tooltip && (
          <Tooltip
            side="top"
            align={getCardHeaderTooltipAlign(tooltip)}
            trigger={
              <button className={styles.cardHeaderTooltipButton} aria-label="Info">
                <IconInfoCircle />
              </button>
            }
          >
            {tooltip}
          </Tooltip>
        )}
      </div>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
};

type CardContentProps = {
  children: React.ReactNode;
};

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ children }, ref) => {
    return (
      <div className={styles.cardContent} ref={ref}>
        {children}
      </div>
    );
  },
);

CardContent.displayName = 'CardContent';
