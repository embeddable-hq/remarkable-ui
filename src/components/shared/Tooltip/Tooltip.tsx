import { FC } from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import { getOrCreateTooltipOverlayContainer, tooltipContentStyle } from './Tooltip.utils';

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
        <RadixTooltip.Portal container={getOrCreateTooltipOverlayContainer() ?? undefined}>
          <RadixTooltip.Content
            side={side}
            align={align}
            style={tooltipContentStyle}
            sideOffset={4}
          >
            {children}
          </RadixTooltip.Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
};
