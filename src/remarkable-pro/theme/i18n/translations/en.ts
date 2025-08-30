import { ResourceLanguage } from 'i18next';

export const en: ResourceLanguage = {
  translation: {
    common: {
      noOptionsFound: 'No options found',
      noOptionsAvailable: 'No options available',
    },
    charts: {
      'menuOptions.downloadCSV': 'Download CSV',
      'menuOptions.downloadPNG': 'Download PNG',
      'menuOptions.downloadXLSX': 'Download XLSX',
      errorTitle: 'Something went wrong.',
      errorMessage: 'An error occurred while loading the chart.',
      emptyTitle: "It's a bit empty here.",
      emptyMessage: 'Try adding something.',
    },
    granularity: {
      quarter: 'Q{{quarter}} {{year}}',
    },
  },
};
