import type { Preview } from '@storybook/react-webpack5';
import { injectCssVariables } from '../src/theme/theme.utils';
import { remarkableTheme } from '../src/theme/theme';

injectCssVariables(remarkableTheme);

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
