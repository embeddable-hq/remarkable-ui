import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useState } from 'react';

import { Switch } from './Switch';

const meta = {
  component: Switch,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    checked: {
      control: 'boolean',
      description: 'The current state of the switch',
    },
    disabled: {
      control: 'boolean',
      description: 'Whether the switch is disabled',
    },
    label: {
      control: 'text',
      description: 'Optional label for the switch',
    },
  },
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

// Interactive Switch with state management
const InteractiveSwitch = ({
  checked: initialChecked,
  onCheckedChange,
  ...props
}: React.ComponentProps<typeof Switch>) => {
  const [checked, setChecked] = useState(initialChecked);
  const handleChange = onCheckedChange || setChecked;

  return <Switch {...props} checked={checked} onCheckedChange={handleChange} />;
};

export const Default: Story = {
  render: (args) => <InteractiveSwitch {...args} />,
  args: {
    checked: false,
    disabled: false,
    label: 'Enable notifications',
    onCheckedChange: undefined,
  },
};

export const Checked: Story = {
  render: (args) => <InteractiveSwitch {...args} />,
  args: {
    checked: true,
    disabled: false,
    label: 'Dark mode enabled',
    onCheckedChange: undefined,
  },
};

export const WithoutLabel: Story = {
  render: (args) => <InteractiveSwitch {...args} />,
  args: {
    checked: false,
    disabled: false,
    onCheckedChange: undefined,
  },
};

export const Disabled: Story = {
  render: (args) => <InteractiveSwitch {...args} />,
  args: {
    checked: false,
    disabled: true,
    label: 'Disabled switch',
    onCheckedChange: undefined,
  },
};

export const DisabledChecked: Story = {
  render: (args) => <InteractiveSwitch {...args} />,
  args: {
    checked: true,
    disabled: true,
    label: 'Disabled checked switch',
    onCheckedChange: undefined,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}
    >
      <InteractiveSwitch checked={false} label="Switch (off)" onCheckedChange={undefined} />
      <InteractiveSwitch checked={true} label="Switch (on)" onCheckedChange={undefined} />
      <InteractiveSwitch
        checked={false}
        disabled={true}
        label="Disabled switch (off)"
        onCheckedChange={undefined}
      />
      <InteractiveSwitch
        checked={true}
        disabled={true}
        label="Disabled switch (on)"
        onCheckedChange={undefined}
      />
    </div>
  ),
  args: {
    checked: false,
    onCheckedChange: undefined,
  },
  parameters: {
    docs: {
      description: {
        story: 'All switch variants and states in one view.',
      },
    },
  },
};
