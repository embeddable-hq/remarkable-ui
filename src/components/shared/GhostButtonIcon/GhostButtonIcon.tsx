import React from 'react';
import clsx from 'clsx';
import { IconProps } from '@tabler/icons-react';
import style from './GhostButtonIcon.module.css';

type GhostButtonIconProps = {
  icon: React.ComponentType<IconProps>;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const GhostButtonIcon = React.forwardRef<HTMLButtonElement, GhostButtonIconProps>(
  ({ icon: Icon, className, ...props }, ref) => {
    return (
      <button ref={ref} className={clsx(style.ghostButtonIcon, className)} {...props}>
        <Icon />
      </button>
    );
  },
);
GhostButtonIcon.displayName = 'GhostButtonIcon';
