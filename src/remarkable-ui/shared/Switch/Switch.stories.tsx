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
  onChange,
  ...props
}: React.ComponentProps<typeof Switch>) => {
  const [checked, setChecked] = useState(initialChecked);
  const handleChange = onChange || setChecked;

  return <Switch {...props} checked={checked} onChange={handleChange} />;
};

export const Default: Story = {
  render: (args) => <InteractiveSwitch {...args} />,
  args: {
    checked: false,
    disabled: false,
    label: 'Enable notifications',
    onChange: undefined,
  },
};

export const Checked: Story = {
  render: (args) => <InteractiveSwitch {...args} />,
  args: {
    checked: true,
    disabled: false,
    label: 'Dark mode enabled',
    onChange: undefined,
  },
};

export const WithoutLabel: Story = {
  render: (args) => <InteractiveSwitch {...args} />,
  args: {
    checked: false,
    disabled: false,
    onChange: undefined,
  },
};

export const Disabled: Story = {
  render: (args) => <InteractiveSwitch {...args} />,
  args: {
    checked: false,
    disabled: true,
    label: 'Disabled switch',
    onChange: undefined,
  },
};

export const DisabledChecked: Story = {
  render: (args) => <InteractiveSwitch {...args} />,
  args: {
    checked: true,
    disabled: true,
    label: 'Disabled checked switch',
    onChange: undefined,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div
      style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}
    >
      <InteractiveSwitch checked={false} label="Switch (off)" onChange={undefined} />
      <InteractiveSwitch checked={true} label="Switch (on)" onChange={undefined} />
      <InteractiveSwitch
        checked={false}
        disabled={true}
        label="Disabled switch (off)"
        onChange={undefined}
      />
      <InteractiveSwitch
        checked={true}
        disabled={true}
        label="Disabled switch (on)"
        onChange={undefined}
      />
    </div>
  ),
  args: {
    checked: false,
    onChange: undefined,
  },
  parameters: {
    docs: {
      description: {
        story: 'All switch variants and states in one view.',
      },
    },
  },
};
