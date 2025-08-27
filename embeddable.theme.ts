import { Theme } from './src/remarkable-pro/theme/theme.types';
import { remarkableTheme } from './src/remarkable-pro/theme/theme.constants';

const themeProvider = (): Theme => {
  return remarkableTheme;
};

export default themeProvider;
