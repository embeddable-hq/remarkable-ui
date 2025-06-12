const baseVariables = {
	/* Gray */
	'--em-gray-0': '#fff',
	'--em-gray-50': '#f7f7f8',
	'--em-gray-100': '#ededf1',
	'--em-gray-200': '#e4e4ea',
	'--em-gray-300': '#d2d2d5',
	'--em-gray-400': '#b8b8bd',
	'--em-gray-500': '#909098',
	'--em-gray-600': '#727279',
	'--em-gray-700': '#5c5c66',
	'--em-gray-800': '#31313d',
	'--em-gray-900': '#212129',

	/* Orange */
	'--em-orange-50': '#ffeee6',
	'--em-orange-100': '#ffddcc',
	'--em-orange-200': '#ffccb3',
	'--em-orange-300': '#ffbb99',
	'--em-orange-400': '#ffaa80',
	'--em-orange-500': '#ff9966',
	'--em-orange-600': '#ff884d',
	'--em-orange-700': '#ff7733',
	'--em-orange-800': '#ff661a',
	'--em-orange-900': '#ff5400',

	/* Typography: Phase 1 */
	'--em-font-native':
		'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
	'--em-font-sans': "'Inter', sans-serif",
	// '--em-font-align-left': 'left',
	// '--em-font-align-center': 'center',
	// '--em-font-align-right': 'right',

	/* Headings */
	'--em-font-size-4xl': '2rem',

	/* Body text */
	'--em-font-size-default': '1rem',
	'--em-font-size-sm': '0.875rem',
	'--em-font-size-xs': '0.75rem',

	/* Font weight */
	'--em-font-weight-regular': '400',
	'--em-font-weight-medium': '500',
	'--em-font-weight-bold': '700',

	/* Font height */
	'--em-font-height-xl': '2.375rem',
	'--em-font-height-lg': '1.188rem',
	'--em-font-height-md': '1',
	'--em-font-height-sm': '0.875rem',

	/*Font alignment */
	'--em-text-left': 'left',
	'--em-text-center': 'center',
	'--em-text-right': 'right',

	/* Spacing & Size – Paddings */
	'--em-padding-0': '0rem',
	'--em-padding-0-5': '0.125rem',
	'--em-padding-1': '0.25rem',
	'--em-padding-1-5': '0.375rem',
	'--em-padding-2': '0.5rem',
	'--em-padding-3': '0.75rem',
	'--em-padding-4': '1rem',
	'--em-padding-5': '1.25rem',
	'--em-padding-6': '1.5rem',
	'--em-padding-7': '1.75rem',
	'--em-padding-8': '2rem',
	'--em-padding-9': '2.25rem',
	'--em-padding-10': '2.5rem',
	'--em-padding-12': '3rem',
	'--em-padding-16': '4rem',
	'--em-padding-20': '5rem',
	'--em-padding-24': '6rem',
	'--em-padding-32': '8rem',
	'--em-padding-40': '10rem',
	'--em-padding-48': '12rem',
	'--em-padding-56': '14rem',
	'--em-padding-64': '16rem',

	/* Spacing & Size – Margins */
	'--em-margin-0': '0rem',
	'--em-margin-0-5': '0.125rem',
	'--em-margin-1': '0.25rem',
	'--em-margin-1-5': '0.375rem',
	'--em-margin-2': '0.5rem',
	'--em-margin-3': '0.75rem',
	'--em-margin-4': '1rem',
	'--em-margin-5': '1.25rem',
	'--em-margin-6': '1.5rem',
	'--em-margin-7': '1.75rem',
	'--em-margin-8': '2rem',
	'--em-margin-9': '2.25rem',
	'--em-margin-10': '2.5rem',
	'--em-margin-12': '3rem',
	'--em-margin-16': '4rem',
	'--em-margin-20': '5rem',
	'--em-margin-24': '6rem',
	'--em-margin-32': '8rem',
	'--em-margin-40': '10rem',
	'--em-margin-48': '12rem',
	'--em-margin-56': '14rem',
	'--em-margin-64': '16rem',

	/* Spacing & Size – Height */
	'--em-height-0': '0rem',
	'--em-height-0-5': '0.125rem',
	'--em-height-1': '0.25rem',
	'--em-height-1-5': '0.375rem',
	'--em-height-2': '0.5rem',
	'--em-height-3': '0.75rem',
	'--em-height-4': '1rem',
	'--em-height-5': '1.25rem',
	'--em-height-6': '1.5rem',
	'--em-height-7': '1.75rem',
	'--em-height-8': '2rem',
	'--em-height-9': '2.25rem',
	'--em-height-10': '2.5rem',
	'--em-height-12': '3rem',
	'--em-height-16': '4rem',
	'--em-height-20': '5rem',
	'--em-height-24': '6rem',
	'--em-height-32': '8rem',
	'--em-height-40': '10rem',
	'--em-height-48': '12rem',
	'--em-height-56': '14rem',
	'--em-height-64': '16rem',
	'--em-height-128': '32rem',

	/* Spacing & Size – Width */
	'--em-width-0': '0rem',
	'--em-width-0-5': '0.125rem',
	'--em-width-1': '0.25rem',
	'--em-width-1-5': '0.375rem',
	'--em-width-2': '0.5rem',
	'--em-width-3': '0.75rem',
	'--em-width-4': '1rem',
	'--em-width-5': '1.25rem',
	'--em-width-6': '1.5rem',
	'--em-width-7': '1.75rem',
	'--em-width-8': '2rem',
	'--em-width-9': '2.25rem',
	'--em-width-10': '2.5rem',
	'--em-width-12': '3rem',
	'--em-width-16': '4rem',
	'--em-width-20': '5rem',
	'--em-width-24': '6rem',
	'--em-width-32': '8rem',
	'--em-width-40': '10rem',
	'--em-width-48': '12rem',
	'--em-width-56': '14rem',
	'--em-width-64': '16rem',
	'--em-width-128': '32rem',

	/* Border – Border Radius */
	'--em-rounded-none': '0rem',
	'--em-rounded-sm': '0.125rem',
	'--em-rounded-default': '0.25rem',
	'--em-rounded-md': '0.375rem',
	'--em-rounded-lg': '0.5rem',
	'--em-rounded-xl': '0.75rem',
	'--em-rounded-2xl': '1rem',
	'--em-rounded-3xl': '2rem',
	'--em-rounded-full': '624.9375rem',

	/* Border – Border Width */
	'--em-border-0': '0rem',
	'--em-border-default': '0.0625rem',
	'--em-border-2': '0.125rem',
	'--em-border-4': '0.25rem',

	/* Border – Border Style */
	'--em-border-solid': 'solid',
	'--em-border-dashed': 'dashed',
	'--em-border-dotted': 'dotted',
};

const semanticVariables = {
	/* Background Colors */
	'--em-background-neutral': 'var(--em-gray-0)',
	'--em-background-default': 'var(--em-gray-50)',
	'--em-background-light': 'var(--em-gray-100)',
	'--em-background-subtle': 'var(--em-gray-200)',
	'--em-background-muted': 'var(--em-gray-300)',

	/* Foreground Colors */
	'--em-foreground-default': 'var(--em-gray-900)',
	'--em-foreground-muted': 'var(--em-gray-700)',
	'--em-foreground-subtle': 'var(--em-gray-400)',
	'--em-foreground-inverted': 'var(--em-gray-0)',

	/* Font Defaults */
	'--em-font-default': 'var(--em-font-native)',
	'--em-text-align-default': 'var(--em-text-left)',

	/* Box Shadow – Default */
	'--em-default-shadow': '0px 1px 40px 0px rgba(33, 33, 41, 0.25)',

	/* Icons (Namespace: --em-icn-) */
	'--em-icn-width': 'var(--em-icn-width)',
	'--em-icn-height': 'var(--em-height-4)',
	'--em-icn-color': 'var(--em-foreground-default)',

	/* Borders */
	'--em-border-default': '1px solid var(--em-background-muted)',
	'--em-border-radius-default': 'var(--em-rounded-xl)',
};

const componentVariables = {
	/* Primary Button (Namespace: --em-primary-btn-) */
	'--em-primary-btn-padding': 'var(--em-padding-3)',
	'--em-primary-btn-text-default': 'var(--em-foreground-inverted)',
	'--em-primary-btn-text-hover': 'var(--em-foreground-inverted)',
	'--em-primary-btn-text-pressed': 'var(--em-foreground-inverted)',
	'--em-primary-btn-text-disabled': 'var(--em-foreground-subtle)',
	'--em-primary-btn-background-default': 'var(--em-foreground-muted)',
	'--em-primary-btn-background-hover': 'var(--em-foreground-default)',
	'--em-primary-btn-background-pressed': 'var(--em-foreground-neutral)',
	'--em-primary-btn-background-disabled': 'var(--em-background-light)',
	'--em-primary-btn-border-radius': 'var(--em-rounded-full)',
	'--em-primary-btn-border': 'none',
	'--em-primary-btn-gap': 'var(--em-padding-2)',
	'--em-primary-btn-font-weight': 'var(--em-font-weight-medium)',
	'--em-primary-btn-font-size': 'var(--em-font-size-sm)',

	/* Icon Button (Namespace: --em-icn-btn-) */
	'--em-icn-btn-radius': 'var(--em-rounded-full)',
	'--em-icn-btn-padding': 'var(--em-padding-2) var(--em-padding-0-5)',
	'--em-icn-btn-background': 'var(--em-background-light)',
	'--em-icn-btn-background-hover': 'var(--em-background-subtle)',
	'--em-icn-btn-background-pressed': 'var(--em-background-muted)',
	'--em-icn-btn-background-disabled': 'var(--em-background-light)',
	'--em-icn-btn-icon-width': 'var(--em-icn-width)',
	'--em-icn-btn-icon-height': 'var(--em-icn-height)',
	'--em-icn-btn-color': 'var(--em-icn-color)',
	// '--em-icn-btn-color-hover': 'var(--em-foreground-default)', unused
	// '--em-icn-btn-color-pressed': 'var(--em-foreground-default)', unused
	// '--em-icn-btn-color-disabled': 'var(--em-foreground-subtle)', unused

	/* Select Menu – Dropdown Menu and List Item (Namespace: --em-li-) */
	'--em-dropdown-padding': 'var(--em-padding-2)',
	'--em-dropdown-border-radius': 'var(--em-rounded-xl)',
	'--em-dropdown-background': 'var(--em-background-neutral)',
	'--em-dropdown-color': 'var(--em-foreground-default)',
	'--em-dropdown-max-height': 'var(--em-height-128)',
	'--em-dropdown-gap': 'var(--em-padding-0)',
	'--em-li-height': 'var(--em-height-8)',
	'--em-li-padding': 'var(--em-padding-2)',
	'--em-li-radius': 'var(--em-rounded-lg)',
	'--em-li-label-padding': 'var(--em-padding-0) var(--em-padding-2)',
	'--em-li-label-family': 'var(--em-font-default)',
	'--em-li-label-size': 'var(--em-font-size-xs)',
	'--em-li-label-weight': 'var(--em-font-weight-medium)',
	'--em-li-label-line-height': 'var(--em-font-height-sm)',
	'--em-li-label-color': 'var(--em-foreground-default)',
	'--em-li-label-color-hover': 'var(--em-foreground-default)',
	'--em-li-label-color-pressed': 'var(--em-foreground-default)',
	'--em-li-label-color-disabled': 'var(--em-foreground-neutral)',
	'--em-li-icn-width': 'var(--em-icn-width)',
	'--em-li-icn-height': 'var(--em-icn-height)',
	'--em-li-icn-color': 'var(--em-foreground-default)',
	'--em-li-gap': 'var(--em-padding-2)',
	'--em-li-search-background': 'var(--em-background-default)',
	'--em-li-search-background-hover': 'var(--em-background-subtle)',

	/* Select Menu Dropdown Button (Namespace: --em-dropdown-button-) */
	/* Used for single, multi-select, and other dropdown buttons */
	'--em-dropdown-button-height': '40px',
	'--em-dropdown-button-padding': 'var(--em-padding-3)',
	'--em-dropdown-button-gap': 'var(--em-padding-2)',
	'--em-dropdown-button-border-radius': 'var(--em-border-radius-default)',
	'--em-dropdown-button-border': 'var(--em-border-default)',
	'--em-dropdown-button-background': 'var(--em-background-neutral)',
	'--em-dropdown-button-color': 'var(--em-foreground-default)',
	'--em-dropdown-button-hover-background': 'var(--em-background-default)',
	'--em-dropdown-button-hover-border': '1px solid var(--em-background-muted)',
	'--em-dropdown-button-pressed-background': 'var(--em-background-light)',
	'--em-dropdown-button-pressed-border': '1px solid var(--em-background-muted)',
	'--em-dropdown-button-font-family': 'var(--em-font-default)',
	'--em-dropdown-button-font-size': 'var(--em-font-size-xs)',
	'--em-dropdown-button-font-weight': 'var(--em-font-weight-medium)',

	/* Card - Control Surface */
	'--em-control-surface-gap': 'var(--em-padding-4)',

	/* Card – Surface (Namespace: --em-surface-) */
	'--em-surface-background': 'var(--em-background-default)',
	'--em-surface-padding': 'var(--em-padding-8)',
	'--em-surface-gap': 'var(--em-padding-8)',
	'--em-surface-radius': 'var(--em-rounded-3xl)',
	'--em-surface-font-family': 'var(--em-font-default)',

	/* Card Header (Namespace: --em-card-header-) */
	'--em-card-header-gap': 'var(--em-padding-1)',
	'--em-card-header-content-gap': 'var(--em-padding-4)',

	/* Card Title (Namespace: --em-card-title-) */
	'--em-card-title-family': 'var(--em-font-default)',
	'--em-card-title-size': 'var(--em-font-size-default)',
	'--em-card-title-weight': 'var(--em-font-weight-bold)',
	'--em-card-title-line-height': 'var(--em-font-height-lg)',
	'--em-card-title-color': 'var(--em-foreground-default)',
	'--em-card-title-align': ' var(--em-text-align-default)',

	/* Card Subtitle (Namespace: --em-card-subtitle-) */
	'--em-card-subtitle-family': 'var(--em-font-default)',
	'--em-card-subtitle-size': 'var(--em-font-size-sm)',
	'--em-card-subtitle-weight': 'var(--em-font-weight-medium)',
	'--em-card-subtitle-line-height': 'var(--em-font-height-md)',
	'--em-card-subtitle-color': 'var(--em-foreground-muted)',
	'--em-card-subtitle-align': 'var(--em-text-align-default)',

	/* Card Spinner (Namespace: --em-card-spinner-) */
	'--em-card-spinner-width': 'var(--em-width-6)',
	'--em-card-spinner-height': 'var(--em-height-6)',
	'--em-card-spinner-color': 'var(--em-foreground-default)',

	/* Card Error (Namespace: --em-card-error-) */
	'--em-card-message-gap': 'var(--em-padding-3)',
	'--em-card-message-icon-width': 'var(--em-icn-width)',
	'--em-card-message-icon-height': 'var(--em-icn-height)',
	'--em-card-error-icon-color': 'var(--em-foreground-error)',
	'--em-card-error-family': 'var(--em-font-default)',
	'--em-card-message-family': 'var(--em-font-default)',
	'--em-card-message-default-color': 'var(--em-foreground-default)',
	'--em-card-message-size': 'var(--em-font-size-sm)',
	'--em-card-message-weight': 'var(--em-font-weight-medium)',
	'--em-card-message-line-height': 'var(--em-font-height-md)',
	'--em-card-error-color': 'var(--em-foreground-error)',

	/* Chart Essentials - Fonts*/
	// TODO: These are currently unused - to decide: set the chartJS defaults?
	// '--em-chart-font-family-default': 'var(--em-font-default)',
	// '--em-chart-font-weight-default': 'var(--em-font-weight-medium)',
	// '--em-chart-font-size-default': 'var(--em-text-xs)',
	// '--em-chart-font-color-default': 'var(--em-foreground-default)',

	/* Chart Essentials – Category Legend Indicator (Namespace: --em-cat-indicator-) */
	'--em-cat-indicator-width': 'var(--em-width-2)',
	'--em-cat-indicator-height': 'var(--em-height-2)',

	/* Category Name (Namespace: --em-cat-name-) */
	'--em-cat-name-family': 'var(--em-font-default)',
	'--em-cat-name-size': 'var(--em-font-size-xs)',
	'--em-cat-name-weight': 'var(--em-font-weight-medium)',
	'--em-cat-name-color': 'var(--em-foreground-muted)',

	/* Chart Label (Namespace: --em-chart-label-) */
	'--em-chart-label-padding-top': 'var(--em-padding-0-5)',
	'--em-chart-label-padding-bottom': 'var(--em-padding-0-5)',
	'--em-chart-label-padding-left': 'var(--em-padding-0-5)',
	'--em-chart-label-padding-right': 'var(--em-padding-0-5)',
	'--em-chart-label-background': 'var(--em-background-neutral)',
	'--em-chart-label-radius': 'var(--em-rounded-full)',
	'--em-chart-label-family': 'var(--em-font-default)',
	'--em-chart-label-size': 'var(--em-font-size-xs)',
	'--em-chart-label-weight': 'var(--em-font-weight-medium)',
	'--em-chart-label-color': 'var(--em-foreground-default)',

	/* Chart Tooltip (Namespace: --em-chart-tooltip-) */
	'--em-chart-tooltip-padding': 'var(--em-padding-4)',
	'--em-chart-tooltip-radius': 'var(--em-rounded-xl)',
	'--em-chart-tooltip-gap': 'var(--em-padding-2)',
	'--em-chart-tooltip-background': 'var(--em-background-inverted)',
	'--em-chart-tooltip-title-family': 'var(--em-font-default)',
	'--em-chart-tooltip-title-size': 'var(--em-font-size-xs)',
	'--em-chart-tooltip-title-weight': 'var(--em-font-weight-bold)',
	'--em-chart-tooltip-title-color': 'var(--em-foreground-inverted)',
	'--em-chart-tooltip-title-align': 'var(--em-text-align-default)',
	'--em-chart-tooltip-category-family': 'var(--em-font-default)',
	'--em-chart-tooltip-category-size': 'var(--em-font-size-xs)',
	'--em-chart-tooltip-category-weight': 'var(--em-font-weight-medium)',
	'--em-chart-tooltip-category-color': 'var(--em-foreground-inverted)',
	'--em-chart-tooltip-category-align': 'var(--em-text-align-default)',

	/* Radio Button (Namespace: --em-radio-) */
	'--em-radio-width': 'var(--em-width-4)',
	'--em-radio-height': 'var(--em-height-4)',
	'--em-radio-color-unselected': 'var(--em-foreground-default)',
	'--em-radio-color-selected': 'var(--em-foreground-default)',
	'--em-radio-color-unselected-disabled': 'var(--em-foreground-subtle)',
	'--em-radio-color-selected-disabled': 'var(--em-foreground-subtle)',

	/* Checkbox (Namespace: --em-checkbox-) */
	'--em-checkbox-width': 'var(--em-width-4)',
	'--em-checkbox-height': 'var(--em-height-4)',
	'--em-checkbox-color-unselected': 'var(--em-foreground-default)',
	'--em-checkbox-color-selected': 'var(--em-foreground-default)',
	'--em-checkbox-color-unselected-disabled': 'var(--em-foreground-subtle)',
	'--em-checkbox-color-selected-disabled': 'var(--em-foreground-subtle)',

	/* Pie & Donut – Donut Number (Namespace: --em-donut-number-) */
	'--em-donut-number-family': 'var(--em-font-default)',
	'--em-donut-number-size': 'var(--em-font-size-4xl)',
	'--em-donut-number-weight': 'var(--em-font-weight-bold)',
	'--em-donut-number-color': 'var(--em-foreground-default)',

	/* Donut Measure Label (Namespace: --em-donut-dimension-) */
	'--em-donut-label-family': 'var(--em-font-default)',
	'--em-donut-label-size': 'var(--em-font-size-default)',
	'--em-donut-label-weight': 'var(--em-font-weight-medium)',
	'--em-donut-label-color': 'var(--em-foreground-muted)',
};

export const cssVariables: Record<string, string> = {
	...baseVariables,
	...semanticVariables,
	...componentVariables,
};
