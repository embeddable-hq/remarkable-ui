import { Theme } from './theme';

const generateCssVariables = (variables: Record<string, string>) => {
  let textContent = '';
  Object.keys(variables).forEach((key) => {
    const value = variables[key];
    textContent += `${key}: ${value};\n`;
  });
  return textContent;
};

export const injectCssVariables = (newTheme: Theme) => {
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
};
