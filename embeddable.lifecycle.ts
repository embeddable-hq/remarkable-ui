import { injectCssVariables } from './src/remarkable-pro/theme/styles/styles.utils';
import { Theme } from './src/remarkable-pro/theme/theme.types';

export default {
  onThemeUpdated: (theme: Theme) => injectCssVariables(theme.styles),
};
