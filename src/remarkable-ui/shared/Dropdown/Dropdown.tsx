import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { FC } from 'react';

export type DropdownProps = {
  triggerComponent: React.ReactNode;
  children: React.ReactNode;
  disabled?: boolean;
};

export const Dropdown: FC<DropdownProps> = ({ triggerComponent, children, disabled }) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild disabled={disabled}>
        {triggerComponent}
      </DropdownMenu.Trigger>
      <DropdownMenu.Content side="bottom" align="center">
        {children}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
};
