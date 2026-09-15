import { FC, useCallback, useState } from 'react';
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
  // Content portaled to the body-level overlay container can never paint
  // above a modal dialog (the top layer covers the whole document), so when
  // the trigger sits inside a dialog the content must portal into it.
  const [dialogContainer, setDialogContainer] = useState<HTMLElement | null>(null);

  const handleTriggerRef = useCallback((node: HTMLButtonElement | null) => {
    setDialogContainer(node?.closest('dialog') ?? null);
  }, []);

  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root delayDuration={delayDuration}>
        <RadixTooltip.Trigger asChild ref={handleTriggerRef}>
          {trigger}
        </RadixTooltip.Trigger>
        <RadixTooltip.Portal
          container={dialogContainer ?? getOrCreateTooltipOverlayContainer() ?? undefined}
        >
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
