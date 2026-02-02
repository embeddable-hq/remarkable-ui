import { FC } from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import styles from './Tooltip.module.css';

type TooltipProps = {
  side?: RadixTooltip.TooltipContentProps['side'];
  align?: RadixTooltip.TooltipContentProps['align'];
  trigger: React.ReactNode;
  children: React.ReactNode;
  delayDuration?: number;
};

export const Tooltip: FC<TooltipProps> = ({
  side,
  align,
  trigger,
  children,
  delayDuration = 0,
}) => {
  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root delayDuration={delayDuration}>
        <RadixTooltip.Trigger asChild>{trigger}</RadixTooltip.Trigger>
        <RadixTooltip.Content
          side={side}
          align={align}
          style={{ zIndex: 5 }}
          className={styles.tooltipContent}
          sideOffset={4}
        >
          {children}
        </RadixTooltip.Content>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
};
