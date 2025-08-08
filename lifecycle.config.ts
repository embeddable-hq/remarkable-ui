import { injectCssVariables } from './src/remarkable-ui-embeddables/theme/styles/stytles.utils';
import { Theme } from './src/remarkable-ui-embeddables/theme/theme.types';

export default {
  onThemeUpdated: (theme: Theme) => injectCssVariables(theme.styles),
};
