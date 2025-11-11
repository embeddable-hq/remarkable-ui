import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { GhostButton } from './GhostButton';
import {
  IconBoltFilled,
  IconDownload,
  IconSettings,
  IconTrash,
  IconChevronRight,
  IconExternalLink,
} from '@tabler/icons-react';

const meta = {
  component: GhostButton,
  argTypes: {
    startIcon: {
      options: ['IconBoltFilled', 'IconDownload', 'IconSettings', 'IconTrash', 'None'],
      mapping: {
        IconBoltFilled,
        IconDownload,
        IconSettings,
        IconTrash,
        None: undefined,
      },
      control: { type: 'select' },
    },
    endIcon: {
      options: ['IconChevronRight', 'IconExternalLink', 'IconBoltFilled', 'None'],
      mapping: {
        IconChevronRight,
        IconExternalLink,
        IconBoltFilled,
        None: undefined,
      },
      control: { type: 'select' },
    },
  },
} satisfies Meta<typeof GhostButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Ghost Button',
    startIcon: IconBoltFilled,
    disabled: false,
    onClick: () => console.log('Ghost button clicked!'),
  },
};

export const WithDownloadIcon: Story = {
  args: {
    children: 'Download',
    startIcon: IconDownload,
    disabled: false,
    onClick: () => console.log('Download clicked!'),
  },
};

export const WithSettingsIcon: Story = {
  args: {
    children: 'Settings',
    startIcon: IconSettings,
    disabled: false,
    onClick: () => console.log('Settings clicked!'),
  },
};

export const WithoutIcon: Story = {
  args: {
    children: 'No Icon',
    disabled: false,
    onClick: () => console.log('Button clicked!'),
  },
};

export const WithEndIcon: Story = {
  args: {
    children: 'Next',
    endIcon: IconChevronRight,
    disabled: false,
    onClick: () => console.log('Next clicked!'),
  },
};

export const WithBothIcons: Story = {
  args: {
    children: 'Open External',
    startIcon: IconDownload,
    endIcon: IconExternalLink,
    disabled: false,
    onClick: () => console.log('Open external clicked!'),
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    startIcon: IconBoltFilled,
    disabled: true,
    onClick: () => console.log('This should not fire'),
  },
};
