import { Theme } from './src/remarkable-ui-embeddables/theme/theme.types';
import { remarkableTheme } from './src/remarkable-ui-embeddables/theme/theme.constants';

const themeProvider = (): Theme => {
  return remarkableTheme;
};

export default themeProvider;
