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
      tablePaginated: {
        pagination: 'Seite {{page}} von {{totalPages}}',
      },
      pivotTable: {
        total: 'Gesamt',
      },
      kpiChart: {
        noPreviousData: 'Keine vorherigen Daten',
      },
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
      dateRangeOptions: {
        today: 'Heute',
        yesterday: 'Gestern',
        thisWeek: 'Diese Woche',
        lastWeek: 'Letzte Woche',
        weekToDate: 'Woche bis heute',
        last7Days: 'Letzte 7 Tage',
        next7Days: 'Nächste 7 Tage',
        last30Days: 'Letzte 30 Tage',
        next30Days: 'Nächste 30 Tage',
        thisMonth: 'Dieser Monat',
        lastMonth: 'Letzter Monat',
        nextMonth: 'Nächster Monat',
        thisQuarter: 'Dieses Quartal',
        lastQuarter: 'Letztes Quartal',
        nextQuarter: 'Nächstes Quartal',
        quarterToDate: 'Quartal bis heute',
        last6Months: 'Letzte 6 Monate',
        last12Months: 'Letzte 12 Monate',
        thisYear: 'Dieses Jahr',
        lastYear: 'Letztes Jahr',
        nextYear: 'Nächstes Jahr',
        yearToDate: 'Jahr bis heute',
      },
    },
    granularity: {
      quarter: '{{quarter}}. Quartal {{year}}',
    },
  },
};
