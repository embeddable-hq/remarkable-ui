import { injectCssVariables } from './src/theme/theme.utils';
// LifeCycle.config.ts
// •	Handles global theming logic (e.g. setting fonts, applying CSS variables).
// •	Uses the onThemeUpdated hook.
// •	Called only when the theme updates (e.g. when new theme passed in via clientContext).
// •	Receives the new theme as an argument.
// •	Returns a cleanup function to remove applied styles (e.g. fonts, variables).

export default {
  onThemeUpdated: injectCssVariables,
};
