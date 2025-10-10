import { ResourceLanguage } from 'i18next';

export const en: ResourceLanguage = {
  translation: {
    common: {
      other: 'Other',
      noOptionsFound: 'No options found',
      noOptionsAvailable: 'No options available',
      previous: 'Previous',
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
    editors: {
      errorTitle: 'Something went wrong.',
    },
    defaults: {
      comparisonPeriodOptions: {
        previousPeriod: 'Previous period',
        previousWeek: 'Previous week',
        previousMonth: 'Previous month',
        previousQuarter: 'Previous quarter',
        previousYear: 'Previous year',
      },
    },
    granularity: {
      quarter: 'Q{{quarter}} {{year}}',
    },
  },
};
