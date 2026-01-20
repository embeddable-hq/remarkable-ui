import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { FC } from 'react';

export type DropdownProps = {
  triggerComponent: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
  open?: boolean;
  side?: React.ComponentProps<typeof DropdownMenu.Content>['side'];
  align?: React.ComponentProps<typeof DropdownMenu.Content>['align'];
  avoidCollisions?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const Dropdown: FC<DropdownProps> = ({
  triggerComponent,
  children,
  disabled,
  open,
  side = 'bottom',
  align = 'start',
  avoidCollisions = true,
  onOpenChange,
}) => {
  return (
    <DropdownMenu.Root open={open} onOpenChange={onOpenChange} modal={false}>
      <DropdownMenu.Trigger asChild disabled={disabled}>
        {triggerComponent}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content
        side={side}
        align={align}
        style={{ zIndex: 5 }}
        avoidCollisions={avoidCollisions}
      >
        {children}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
