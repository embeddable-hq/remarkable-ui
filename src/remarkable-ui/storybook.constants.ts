import { IconBoltFilled } from '@tabler/icons-react';
import { InputType } from 'storybook/internal/csf';
import { stylesTokensCore } from './styles/styles.tokensCore.constants';

export const storybookArgTypesIcon: InputType = {
  options: ['IconBoltFilled', '-'],
  mapping: {
    IconBoltFilled,
    '-': undefined,
  },
  control: { type: 'select' },
};

export const storybookStyleLabel = {
  background: stylesTokensCore['--em-core-color-gray--0000'],
  padding: stylesTokensCore['--em-core-spacing--0100'],
};
