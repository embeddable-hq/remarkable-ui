import { ResourceLanguage } from 'i18next';

export const de: ResourceLanguage = {
  translation: {
    common: {
      other: 'Andere',
      noOptionsFound: 'Keine Optionen gefunden',
      noOptionsAvailable: 'Keine Optionen verfügbar',
      compared: 'Verglichen',
    },
    dimension: {
      'customers.country.United States': 'Vereinigte Staaten',
      'customers.country.Germany': 'Deutschland',
      'customers.country.United Kingdom': 'Vereinigtes Königreich',
      'customers.country.New Zealand': 'Neuseeland',
      'customers.country.Belgium': 'Belgien',
      'customers.country.Australia': 'Australien',
      'customers.country.Canada': 'Kanada',
      'customers.country.Iceland': 'Island',
      Other: 'Andere',
    },
    charts: {
      label: 'Beschriftung',
      primaryPeriod: 'Primärzeitraum',
      comparisonPeriod: 'Vergleichszeitraum',
      'menuOptions.downloadCSV': 'CSV herunterladen',
      'menuOptions.downloadPNG': 'PNG herunterladen',
      'menuOptions.downloadXLSX': 'XLSX herunterladen',
      errorTitle: 'Etwas ist schiefgelaufen.',
      errorMessage: 'Beim Laden des Diagramms ist ein Fehler aufgetreten.',
      emptyTitle: 'Hier ist es etwas leer.',
      emptyMessage: 'Versuchen Sie, etwas hinzuzufügen.',
    },
    editors: {
      errorTitle: 'Etwas ist schiefgelaufen.',
    },
    defaults: {
      comparisonPeriodOptions: {
        previousPeriod: 'Vorheriger Zeitraum',
        previousWeek: 'Vorherige Woche',
        previousMonth: 'Vorheriger Monat',
        previousQuarter: 'Vorheriges Quartal',
        previousYear: 'Vorheriges Jahr',
      },
    },
    granularity: {
      quarter: '{{quarter}}. Quartal {{year}}',
    },
  },
};
