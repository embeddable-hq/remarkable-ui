export const stylesTokensSemantic = {
  // Backgrounds
  '--em-sem-background': 'var(--em-core-color-gray-050)',
  '--em-sem-background--inverted': 'var(--em-core-color-gray-900)',
  '--em-sem-background--light': 'var(--em-core-color-gray-100)',
  '--em-sem-background--muted': 'var(--em-core-color-gray-300)',
  '--em-sem-background--neutral': 'var(--em-core-color-gray--0)',
  '--em-sem-background--subtle': 'var(--em-core-color-gray--200)',

  // Chart palette
  '--em-sem-chart-color--1': 'var(--em-core-color-orange--900)',
  '--em-sem-chart-color--10': 'var(--em-core-color-orange--050)',
  '--em-sem-chart-color--2': 'var(--em-core-color-orange--800)',
  '--em-sem-chart-color--3': 'var(--em-core-color-orange--700)',
  '--em-sem-chart-color--4': 'var(--em-core-color-orange--600)',
  '--em-sem-chart-color--5': 'var(--em-core-color-orange--500)',
  '--em-sem-chart-color--6': 'var(--em-core-color-orange--400)',
  '--em-sem-chart-color--7': 'var(--em-core-color-orange--300)',
  '--em-sem-chart-color--8': 'var(--em-core-color-orange--200)',
  '--em-sem-chart-color--9': 'var(--em-core-color-orange--100)',

  // Status (new improved structure)
  '--em-sem-status-background--error': 'rgb(246 226 226)',
  '--em-sem-status-text--error': 'rgb(188 16 16)',

  '--em-sem-status-background--positive': 'rgb(225 240 233)',
  '--em-sem-status-text--success': 'rgb(15 149 90)',

  // Text colors
  '--em-sem-text': 'var(--em-core-color-gray--900)',
  '--em-sem-text--inverted': 'var(--em-core-color-gray--0)',
  '--em-sem-text--muted': 'var(--em-core-color-gray--700)',
  '--em-sem-text--neutral': 'var(--em-core-color-gray--1000)',
  '--em-sem-text--subtle': 'var(--em-core-color-gray--400)',
};

type StylesTokensSemantic = typeof stylesTokensSemantic;
export type StylesTokensSemanticKeys = keyof StylesTokensSemantic;
