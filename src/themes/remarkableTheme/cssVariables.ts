const baseVariables = {
	/* Gray */
    '--gray-0': '#fff',
    '--gray-50': '#f9f9fa',
    '--gray-100': '#ededf1',
    '--gray-200': '#e4e4ea',
    '--gray-300': '#d2d2d5',
    '--gray-400': '#b8b8bd',
    '--gray-500': '#909098',
    '--gray-600': '#727279',
    '--gray-700': '#5c5c66',
    '--gray-800': '#31313d',
    '--gray-900': '#212129',

    /* Orange */
    '--orange-50': '#ffeee6',
    '--orange-100': '#ffddcc',
    '--orange-200': '#ffccb3',
    '--orange-300': '#ffbb99',
    '--orange-400': '#ffaa80',
    '--orange-500': '#ff9966',
    '--orange-600': '#ff884d',
    '--orange-700': '#ff7733',
    '--orange-800': '#ff661a',
    '--orange-900': '#ff5400',

    /* Typography: Phase 1 */
    '--font-sans': "'Inter', sans-serif",
    '--font-align-left': 'left',
    '--font-align-center': 'center',
    '--font-align-right': 'right',

    /* Headings */
    '--font-size-4xl': '2rem',

    /* Body text */
    '--font-size-default': '1rem',
    '--font-size-sm': '0.875rem',
    '--font-size-xs': '0.75rem',

    /* Font weight */
    '--font-weight-regular': '400',
    '--font-weight-medium': '500',
    '--font-weight-bold': '700',

    /* Font height */
    '--font-height-xl': '2.375rem',
    '--font-height-lg': '1.188rem',
    '--font-height-md': '1',
    '--font-height-sm': '0.875rem',

    /* Spacing & Size – Paddings */
    '--padding-0': '0rem',
    '--padding-0-5': '0.125rem',
    '--padding-1': '0.25rem',
    '--padding-1-5': '0.375rem',
    '--padding-2': '0.5rem',
    '--padding-3': '0.75rem',
    '--padding-4': '1rem',
    '--padding-5': '1.25rem',
    '--padding-6': '1.5rem',
    '--padding-7': '1.75rem',
    '--padding-8': '2rem',
    '--padding-9': '2.25rem',
    '--padding-10': '2.5rem',
    '--padding-12': '3rem',
    '--padding-16': '4rem',
    '--padding-20': '5rem',
    '--padding-24': '6rem',
    '--padding-32': '8rem',
    '--padding-40': '10rem',
    '--padding-48': '12rem',
    '--padding-56': '14rem',
    '--padding-64': '16rem',

    /* Spacing & Size – Margins */
    '--margin-0': '0rem',
    '--margin-0-5': '0.125rem',
    '--margin-1': '0.25rem',
    '--margin-1-5': '0.375rem',
    '--margin-2': '0.5rem',
    '--margin-3': '0.75rem',
    '--margin-4': '1rem',
    '--margin-5': '1.25rem',
    '--margin-6': '1.5rem',
    '--margin-7': '1.75rem',
    '--margin-8': '2rem',
    '--margin-9': '2.25rem',
    '--margin-10': '2.5rem',
    '--margin-12': '3rem',
    '--margin-16': '4rem',
    '--margin-20': '5rem',
    '--margin-24': '6rem',
    '--margin-32': '8rem',
    '--margin-40': '10rem',
    '--margin-48': '12rem',
    '--margin-56': '14rem',
    '--margin-64': '16rem',

    /* Spacing & Size – Height */
    '--height-0': '0rem',
    '--height-0-5': '0.125rem',
    '--height-1': '0.25rem',
    '--height-1-5': '0.375rem',
    '--height-2': '0.5rem',
    '--height-3': '0.75rem',
    '--height-4': '1rem',
    '--height-5': '1.25rem',
    '--height-6': '1.5rem',
    '--height-7': '1.75rem',
    '--height-8': '2rem',
    '--height-9': '2.25rem',
    '--height-10': '2.5rem',
    '--height-12': '3rem',
    '--height-16': '4rem',
    '--height-20': '5rem',
    '--height-24': '6rem',
    '--height-32': '8rem',
    '--height-40': '10rem',
    '--height-48': '12rem',
    '--height-56': '14rem',
    '--height-64': '16rem',
    '--height-128': '32rem',

    /* Spacing & Size – Width */
    '--width-0': '0rem',
    '--width-0-5': '0.125rem',
    '--width-1': '0.25rem',
    '--width-1-5': '0.375rem',
    '--width-2': '0.5rem',
    '--width-3': '0.75rem',
    '--width-4': '1rem',
    '--width-5': '1.25rem',
    '--width-6': '1.5rem',
    '--width-7': '1.75rem',
    '--width-8': '2rem',
    '--width-9': '2.25rem',
    '--width-10': '2.5rem',
    '--width-12': '3rem',
    '--width-16': '4rem',
    '--width-20': '5rem',
    '--width-24': '6rem',
    '--width-32': '8rem',
    '--width-40': '10rem',
    '--width-48': '12rem',
    '--width-56': '14rem',
    '--width-64': '16rem',
    '--width-128': '32rem',

    /* Border – Border Radius */
    '--rounded-none': '0rem',
    '--rounded-sm': '0.125rem',
    '--rounded-default': '0.25rem',
    '--rounded-md': '0.375rem',
    '--rounded-lg': '0.5rem',
    '--rounded-xl': '0.75rem',
    '--rounded-2xl': '1rem',
    '--rounded-3xl': '2rem',
    '--rounded-full': '624.9375rem',

    /* Border – Border Width */
    '--border-0': '0rem',
    '--border-default': '0.0625rem',
    '--border-2': '0.125rem',
    '--border-4': '0.25rem',

    /* Border – Border Style */
    '--border-solid': 'solid',
    '--border-dashed': 'dashed',
    '--border-dotted': 'dotted',

    /* Box Shadow – Default */
    '--default-shadow': '0px 1px 40px 0px rgba(33, 33, 41, 0.25)',
}

export const cssVariables:Record<string, string> = {
	...baseVariables, 
	
    /* Semantic variables */
    '--background-neutral': 'var(--gray-0)',
    '--background-default': 'var(--gray-50)',
    '--background-light': 'var(--gray-100)', /* could change to 'soft'*/
    '--background-subtle': 'var(--gray-200)',
    '--background-muted': 'var(--gray-300)',
    '--foreground-default': 'var(--gray-900)',
    '--foreground-muted': 'var(--gray-700)',
    '--foreground-subtle': 'var(--gray-400)',
    '--foreground-inverted': 'var(--gray-0)',

    /* New Semantic Variables*/

    '--font-default': 'var(--font-sans)',

    /* Icons (Namespace: --icn-) */

    /* Size */
    '--icn-width': 'var(--width-4)',
    '--icn-height': 'var(--height-4)',

    /* Color */
    '--icn-color': 'var(--foreground-default)',

    /* Icon Button (Namespace: --icn-btn-) */
    /* Layout */
    '--icn-btn-radius': 'var(--rounded-full)',
    '--icn-btn-padding': 'var(--padding-2) var(--padding-0-5)',

    /* Style: different states */
    '--icn-btn-background': 'var(--background-light)',
    '--icn-btn-background-hover': 'var(--background-subtle)',
    '--icn-btn-background-pressed': 'var(--background-muted)',
    '--icn-btn-background-disabled': 'var(--background-light)',

    /* Icon Button Icon (Namespace: --icn-btn-icon-) */
    /* Layout */
    '--icn-btn-icon-width': 'var(--width-4)',
    '--icn-btn-icon-height': 'var(--width-4)',

    /* Style: different states */
    '--icn-btn-color': 'var(--foreground-default)',
    '--icn-btn-color-hover': 'var(--foreground-default)',
    '--icn-btn-color-pressed': 'var(--foreground-default)',
    '--icn-btn-color-disabled': 'var(--foreground-subtle)',

    /* Select Menu – Dropdown and List Item (Namespace: --li-) */

    '--dropdown-padding': 'var(--padding-2)',
    '--dropdown-border-radius': 'var(--rounded-xl)',
    '--dropdown-background': 'var(--background-neutral)',
    '--dropdown-color': 'var(--foreground-default)',
    '--dropdown-max-height': 'var(--height-128)',
    '--dropdown-gap': 'var(--padding-0)',
    
    /* Layout */
    '--li-height': 'var(--height-8)',
    '--li-padding': 'var(--padding-2)',

    /* Style */
    '--li-radius': 'var(--rounded-lg)',

    /* List Item Label (Namespace: --li-label-) */
    /* Layout */
    '--li-label-padding': 'var(--padding-0) var(--padding-2)',

    /* Typography */
    '--li-label-family': "var(--font-default)",
    '--li-label-size': 'var(--font-size-xs)',
    '--li-label-weight': 'var(--font-weight-medium)',
    '--li-label-line-height': 'var(--font-height-sm)',

    /* Style: different states */
    '--li-label-color': 'var(--foreground-default)',
    '--li-label-color-hover': 'var(--foreground-default)',
    '--li-label-color-pressed': 'var(--foreground-default)',
    '--li-label-color-disabled': 'var(--foreground-neutral)',

    /* List Item Icon (Namespace: --li-icn-) */
    /* Layout */
    '--li-icn-width': 'var(--width-4)',
    '--li-icn-height': 'var(--height-4)', // possibly a typo in original (“--icn-icn-height”)

    /* Style: different states */
    '--li-icn-color': 'var(--foreground-default)',
    // '--li-icn-color-hover': 'var(--foreground-default)', /*unused*/
    // '--li-icn-color-pressed': 'var(--foreground-default)', /*unused*/
    // '--li-icn-color-disabled': 'var(--foreground-neutral)', /*unused*/

    /* Card – Surface (Namespace: --surface-) */
    /* Style */
    '--surface-background': 'var(--background-default)',

    /* Layout */
    '--surface-padding': 'var(--padding-8)',
    '--surface-gap': 'var(--padding-8)',
    // '--surface-height': 'var(--height-4)',/* Unused */

    /* Style */
    '--surface-radius': 'var(--rounded-3xl)',

    /* Card Header (Namespace: --card-header-) */
    /* Layout */
    '--card-header-gap': 'var(--padding-1)',
    '--card-header-content-gap': 'var(--padding-4)', /* gap between title and description*/

    /* Card Title (Namespace: --card-title-) */
    /* Typography */
    // '--card-title-family': "var(--font-default)",
    '--card-title-size': 'var(--font-size-default)',
    '--card-title-weight': 'var(--font-weight-bold)',
    '--card-title-line-height': 'var(--font-height-lg)',
    '--card-title-color': 'var(--foreground-default)',

    /* Card Subtitle (Namespace: --card-subtitle-) */
    /* Typography */
    // '--card-subtitle-family': "var(--font-default)",
    '--card-subtitle-size': 'var(--font-size-sm)',
    '--card-subtitle-weight': 'var(--font-weight-medium)',
    '--card-subtitle-line-height': 'var(--font-height-md)',
    '--card-subtitle-color': 'var(--foreground-muted)',

    /* Card Spinner (Namespace: --card-spinner-) */
    /* Layout */
    '--card-spinner-width': 'var(--width-6)',
    '--card-spinner-height': 'var(--height-6)',

    /* Style */
    '--card-spinner-color': 'var(--foreground-default)',

    /* Card Error (Namespace: --card-error-) */
    /* Layout */
    // '--card-error-padding-bottom': 'var(--padding-8)', /*unused*/
    '--card-message-gap': 'var(--padding-3)',

    /* Card Error Icon (Namespace: --card-error-icon-) */
    /* Layout */
    '--card-message-icon-width': 'var(--width-4)',
    '--card-message-icon-height': 'var(--height-4)',

    /* Style */
    '--card-error-icon-color': 'var(--foreground-error)',

    /* Card Message Title (Namespace: --card-error-title-) */
    /* Typography */
    // '--card-error-family': "var(--font-default)", /*unused*/
    '--card-message-default-color': 'var(--foreground-default)',
    '--card-message-size': 'var(--font-size-sm)', // changed to avoid duplication
    '--card-message-weight': 'var(--font-weight-medium)',
    '--card-message-line-height': 'var(--font-height-md)',
    '--card-error-color': 'var(--foreground-error)',

    /* Chart Essentials – Category Legend Indicator (Namespace: --cat-indicator-) */
    /* Layout */
    '--cat-indicator-width': 'var(--width-2)',
    '--cat-indicator-height': 'var(--height-2)',

    /* Style */
    // '--cat-indicator-radius': 'var(--rounded-full)',/* Can't use in ChartJS */
    // '--cat-indicator-color': 'var(--categories-1)', /* Can't use in ChartJS */

    /* Category Name (Namespace: --cat-name-) */
    /* Typography */
    '--cat-name-family': "var(--font-default)",
    '--cat-name-size': 'var(--font-size-xs)',
    '--cat-name-weight': 'var(--font-weight-medium)',
    // '--cat-name-line-height': 'var(--font-height-sm)',/*Unused */
    '--cat-name-color': 'var(--foreground-muted)',

    /* Chart Category (Namespace: --cat-) */
    /* Layout */
    // '--cat-gap': 'var(--padding-1)',//unused

    /* Chart Label (Namespace: --chart-label-) */
    /* Layout */
    // '--chart-label-padding': 'var(--padding-0-5) var(--padding-1)',//unused
    '--chart-label-padding-top': 'var(--padding-0-5)',
    '--chart-label-padding-bottom': 'var(--padding-0-5)',
    '--chart-label-padding-left': 'var(--padding-0-5)',
    '--chart-label-padding-right': 'var(--padding-0-5)', 

    /* Style */
    '--chart-label-background': 'var(--background-neutral)',
    '--chart-label-radius': 'var(--rounded-full)',

    /* Typography */
    '--chart-label-family': "var(--font-default)",
    '--chart-label-size': 'var(--font-size-xs)',
    '--chart-label-weight': 'var(--font-weight-medium)',
    // '--chart-label-line-height': 'var(--font-height-sm)',//unused
    '--chart-label-color': 'var(--foreground-default)',

    /* Chart Tooltip (Namespace: --chart-tooltip-) */
    /* Layout */
    '--chart-tooltip-padding': 'var(--padding-4)',
    // '--chart-tooltip-gap': 'var(--padding-2)', unused
    '--chart-tooltip-radius': 'var(--rounded-xl)',

    /* Style */
    '--chart-tooltip-background': 'var(--background-inverted)',

    /* Chart Tooltip Title (Namespace: --chart-tooltip-title-) */
    /* Typography */
    '--chart-tooltip-title-family': "var(--font-default)",
    '--chart-tooltip-title-size': 'var(--font-size-xs)',
    '--chart-tooltip-title-weight': 'var(--font-weight-bold)',
    // '--chart-tooltip-title-line-height': 'var(--font-height-md)', unused
    '--chart-tooltip-title-color': 'var(--foreground-inverted)',

    /* Chart Tooltip Category (Namespace: --chart-tooltip-category-) */
    /* Typography */
    '--chart-tooltip-category-family': "var(--font-default)",
    '--chart-tooltip-category-size': 'var(--font-size-xs)',
    '--chart-tooltip-category-weight': 'var(--font-weight-medium)',
    // '--chart-tooltip-category-line-height': 'var(--font-height-sm)', unused
    '--chart-tooltip-category-color': 'var(--foreground-inverted)',

    /* Radio Button (Namespace: --radio-) */
    /* Layout */
    '--radio-width': 'var(--width-4)',
    '--radio-height': 'var(--height-4)',

    /* Style: unselected, selected, disabled */
    '--radio-color-unselected': 'var(--foreground-default)',
    '--radio-color-selected': 'var(--foreground-default)',
    '--radio-color-unselected-disabled': 'var(--foreground-subtle)',
    '--radio-color-selected-disabled': 'var(--foreground-subtle)',

    /* Checkbox (Namespace: --checkbox-) */
    /* Layout */
    '--checkbox-width': 'var(--width-4)',
    '--checkbox-height': 'var(--height-4)',

    /* Style: unselected, selected, disabled */
    '--checkbox-color-unselected': 'var(--foreground-default)',
    '--checkbox-color-selected': 'var(--foreground-default)',
    '--checkbox-color-unselected-disabled': 'var(--foreground-subtle)',
    '--checkbox-color-selected-disabled': 'var(--foreground-subtle)',

    /* Pie & Donut – Donut Number (Namespace: --donut-number-) */
    /* Typography */
    '--donut-number-family': "var(--font-default)",
    '--donut-number-size': 'var(--font-size-4xl)',
    '--donut-number-weight': 'var(--font-weight-bold)',
    // '--donut-number-line-height': 'var(--font-height-xl)', unused
    '--donut-number-color': 'var(--foreground-default)',

    /* Donut Measure Label (Namespace: --donut-dimension-) */
    /* Typography */
    '--donut-label-family': "var(--font-default)",
    '--donut-label-size': 'var(--font-size-default)',
    '--donut-label-weight': 'var(--font-weight-medium)',
    // '--donut-label-line-height': 'var(--font-height-lg)',unused
    '--donut-label-color': 'var(--foreground-muted)',
};