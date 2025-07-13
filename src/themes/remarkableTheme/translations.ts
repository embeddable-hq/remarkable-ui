import { Resource } from 'i18next';

export const translations: Resource = {
    en: {
        translation: {
            Dimension: '{{value}}',
            ExportOptions: {
                downloadCSV: {
                    label: 'Download CSV'
                },
                downloadExcel: {
                    label: 'Download Excel'
                },
                downloadPNG: {
                    label: 'Download PNG'
                }
            },
            Granularity: {
                quarter: 'Q{{quarter}} {{year}}'
            },
            Measure: '{{value}}',
        }
    },
    de: {
        translation: {
            Dimension: '{{value}}',
            'Dimension.customers.country.United States': 'Vereinigte Staaten',
            'Dimension.customers.country.Germany': 'Deutschland',
            'Dimension.customers.country.United Kingdom': 'Vereinigtes Königreich',
            'Dimension.customers.country.New Zealand': 'Neuseeland',
            'Dimension.customers.country.Belgium': 'Belgien',
            'Dimension.customers.country.Australia': 'Australien',
            'Dimension.customers.country.Canada': 'Kanada',
            'Dimension.customers.country.Iceland': 'Island',
            ExportOptions: {
                downloadCSV: {
                    label: 'CSV herunterladen'
                },
                downloadExcel: {
                    label: 'Excel herunterladen'
                },
                downloadPNG: {
                    label: 'PNG herunterladen'
                }
            },
            Granularity: {
                quarter: '{{quarter}}. Quartal {{year}}'
            },
            Measure: '{{value}}',
        }
    }
};
