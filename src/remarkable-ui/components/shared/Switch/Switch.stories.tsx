import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { Switch } from './Switch';
import { useArgs } from 'storybook/internal/preview-api';

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

export const Default: Story = {
  render: (args) => {
    const [, updateArgs] = useArgs();

    const handleChange = (checked: boolean) => {
      updateArgs({ checked });
    };

    return <Switch {...args} onChange={handleChange} />;
  },
  args: {
    checked: false,
    disabled: false,
    label: 'Enable notifications',
  },
};

export const Checked: Story = {
  render: (args) => {
    const [, updateArgs] = useArgs();

    const handleChange = (checked: boolean) => {
      updateArgs({ checked });
    };

    return <Switch {...args} onChange={handleChange} />;
  },
  args: {
    checked: true,
    disabled: false,
    label: 'Dark mode enabled',
  },
};

export const WithoutLabel: Story = {
  render: (args) => {
    const [, updateArgs] = useArgs();

    const handleChange = (checked: boolean) => {
      updateArgs({ checked });
    };

    return <Switch {...args} onChange={handleChange} />;
  },
  args: {
    checked: false,
    disabled: false,
  },
};

export const Disabled: Story = {
  render: (args) => {
    const [, updateArgs] = useArgs();

    const handleChange = (checked: boolean) => {
      updateArgs({ checked });
    };

    return <Switch {...args} onChange={handleChange} />;
  },
  args: {
    checked: false,
    disabled: true,
    label: 'Disabled switch',
  },
};

export const DisabledChecked: Story = {
  render: (args) => {
    const [, updateArgs] = useArgs();

    const handleChange = (checked: boolean) => {
      updateArgs({ checked });
    };

    return <Switch {...args} onChange={handleChange} />;
  },
  args: {
    checked: true,
    disabled: true,
    label: 'Disabled checked switch',
  },
};

export const AllVariants: Story = {
  render: (args) => {
    const [, updateArgs] = useArgs();

    const handleChange = (checked: boolean) => {
      updateArgs({ checked });
    };

    return (
      <div
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}
      >
        <Switch {...args} label="Interactive Switch" onChange={handleChange} />
        <Switch checked={false} disabled={true} label="Disabled switch (off)" />
        <Switch checked={true} disabled={true} label="Disabled switch (on)" />
      </div>
    );
  },
  args: {
    checked: false,
    disabled: false,
  },
  parameters: {
    docs: {
      description: {
        story: 'All switch variants and states in one view.',
      },
    },
  },
};
