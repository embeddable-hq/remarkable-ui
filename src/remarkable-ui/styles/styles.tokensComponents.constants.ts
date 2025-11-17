export const stylesTokensComponents = {
  '--em-ghostbutton-background--active': 'var(--em-sem-background--light)',
  '--em-ghostbutton-background--hover': 'var(--em-sem-background)',
  '--em-ghostbutton-border-radius': 'var(--em-core-border-radius--100)',
  '--em-ghostbutton-color': 'var(--em-sem-text)',
  '--em-ghostbutton-color--disabled': 'var(--em-sem-text--subtle)',
  '--em-ghostbutton-font-family': 'var(--em-core-font-family--base)',
  '--em-ghostbutton-font-size': 'var(--em-core-font-size--xs)',
  '--em-ghostbutton-font-weight': 'var(--em-core-font-weight--regular)',
  '--em-ghostbutton-height': 'var(--em-core-size--500)',
  '--em-ghostbutton-icon-size': 'var(--em-core-size--400)',
  '--em-ghostbutton-label-padding-left': 'var(--em-core-spacing--100)',
  '--em-ghostbutton-label-padding-right': 'var(--em-core-spacing--100)',
  '--em-ghostbutton-line-height': 'var(--em-core-line-height--sm)',
  '--em-ghostbutton-padding': 'var(--em-core-spacing--050)',
};

type StylesTokensComponents = typeof stylesTokensComponents;
export type StylesTokensComponentsKeys = keyof StylesTokensComponents;
