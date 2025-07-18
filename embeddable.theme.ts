import { theme } from './src/theme/theme.constants';
import { Theme } from './src/theme/theme.types';

const themeProvider = (): Theme => {
  return theme;
};

export default themeProvider;
