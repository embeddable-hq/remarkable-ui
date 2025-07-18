import { Theme } from './src/theme/theme.types';
// LifeCycle.config.ts
// •	Handles global theming logic (e.g. setting fonts, applying CSS variables).
// •	Uses the onThemeUpdated hook.
// •	Called only when the theme updates (e.g. when new theme passed in via clientContext).
// •	Receives the new theme as an argument.
// •	Returns a cleanup function to remove applied styles (e.g. fonts, variables).

export default {
  onThemeUpdated: (newTheme: Theme) => {
    const css = `:root {\n${generateCssVariables(newTheme.styles)}}`;
    const styleId = 'embeddable-style';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;

    if (styleEl) {
      // overwrite the old vars
      styleEl.textContent = css;
    } else {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      styleEl.textContent = css;
      document.head.appendChild(styleEl);
    }

    return () => styleEl?.remove();
  },
};

const generateCssVariables = (variables: Record<string, string>) => {
  let textContent = '';
  Object.keys(variables).forEach((key) => {
    const value = variables[key];
    textContent += `${key}: ${value};\n`;
  });
  return textContent;
};
