import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { FC } from 'react';

export type DropdownProps = {
  triggerComponent: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export const Dropdown: FC<DropdownProps> = ({
  triggerComponent,
  children,
  disabled,
  open,
  onOpenChange,
}) => {
  return (
    <DropdownMenu.Root open={open} onOpenChange={onOpenChange}>
      <DropdownMenu.Trigger asChild disabled={disabled}>
        {triggerComponent}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content side="bottom" align="center">
        {children}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
