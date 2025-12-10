import { IconAccessibleFilled, IconBoltFilled, IconSquareX, IconTrash } from '@tabler/icons-react';
import { InputType } from 'storybook/internal/csf';
import { stylesTokensCore } from './styles/global.tokens';
import { Meta } from '@storybook/react-webpack5';
import { Card, CardContent, CardHeader } from './components/shared/Card/Card';

export const storybookArgTypesIcon: InputType = {
  options: ['IconBoltFilled', 'IconAccessibleFilled', 'IconSquareX', 'IconTrash'],
  mapping: {
    IconBoltFilled,
    IconAccessibleFilled,
    IconSquareX,
    IconTrash,
  },
  control: { type: 'select' },
};

export const storybookArgTypesIconNullable: InputType = {
  options: [...(storybookArgTypesIcon.options as string[]), '-'],
  mapping: {
    ...storybookArgTypesIcon.mapping,
    '-': undefined,
  },
  control: { type: 'select' },
};

export const storybookStyleLabel = {
  background: stylesTokensCore['--em-core-color-gray--0000'],
  padding: stylesTokensCore['--em-core-spacing--0100'],
};

export const decoratorsSquare: Meta['decorators'] = [
  (Story) => (
    <div
      style={{
        width: 300,
        height: 300,
        display: 'flex',
      }}
    >
      <Story />
    </div>
  ),
];

export const decoratorsResizeCard: Meta['decorators'] = [
  (Story) => (
    <div style={{ width: '400px', height: '400px', resize: 'both', overflow: 'auto' }}>
      <Card style={{ width: '100%', height: '100%' }}>
        <CardHeader title="Resize Card" />
        <CardContent>
          <Story />
        </CardContent>
      </Card>
    </div>
  ),
];
