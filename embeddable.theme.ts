import { Theme } from './src/theme/theme.types';
import { theme } from './src/theme/theme';

const themeProvider = (): Theme => {
  return theme;
};

export default themeProvider;
