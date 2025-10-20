import { injectCssVariables } from './src/remarkable-pro/theme/styles/styles.utils';
import { Theme } from './src/remarkable-pro/theme/theme.types';

const injectInter = () => {
  if (typeof document === 'undefined') return;
  const head = document.head || document.getElementsByTagName('head')[0];
  if (!head) return;
  if (!document.querySelector('link[data-remarkable-inter]')) {
    const pre1 = document.createElement('link');
    pre1.rel = 'preconnect';
    pre1.href = 'https://fonts.googleapis.com';
    head.appendChild(pre1);

    const pre2 = document.createElement('link');
    pre2.rel = 'preconnect';
    pre2.href = 'https://fonts.gstatic.com';
    pre2.crossOrigin = 'anonymous';
    head.appendChild(pre2);

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap';
    link.setAttribute('data-remarkable-inter', '1');
    head.appendChild(link);
  }
};

injectInter();

export default {
  onThemeUpdated: (theme: Theme) => {
    injectInter();
    return injectCssVariables(theme.styles);
  },
};
