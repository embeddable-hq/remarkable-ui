const baseVariables = {
	/* Gray */
	'--gray-0': '#fff',
	'--gray-50': '#f7f7f8',
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
	'--font-native':
		'-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
	'--font-sans': "'Inter', sans-serif",
	// '--font-align-left': 'left',
	// '--font-align-center': 'center',
	// '--font-align-right': 'right',

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

	/*Font alignment */
	'--text-left': 'left',
	'--text-center': 'center',
	'--text-right': 'right',

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
};

const semanticVariables = {
	/* Background Colors */
	'--background-neutral': 'var(--gray-0)',
	'--background-default': 'var(--gray-50)',
	'--background-light': 'var(--gray-100)',
	'--background-subtle': 'var(--gray-200)',
	'--background-muted': 'var(--gray-300)',

	/* Foreground Colors */
	'--foreground-default': 'var(--gray-900)',
	'--foreground-muted': 'var(--gray-700)',
	'--foreground-subtle': 'var(--gray-400)',
	'--foreground-inverted': 'var(--gray-0)',

	/* Font Defaults */
	'--font-default': 'var(--font-native)',
	'--text-align-default': 'var(--text-left)',

	/* Box Shadow – Default */
	'--default-shadow': '0px 1px 40px 0px rgba(33, 33, 41, 0.25)',

	/* Icons (Namespace: --icn-) */
	'--icn-width': 'var(--icn-width)',
	'--icn-height': 'var(--height-4)',
	'--icn-color': 'var(--foreground-default)',

	/* Borders */
	'--border-default': '1px solid var(--background-muted)',
	'--border-radius-default': 'var(--rounded-xl)',
};

const componentVariables = {
	/* Primary Button (Namespace: --primary-btn-) */
	'--primary-btn-padding': 'var(--padding-3)',
	'--primary-btn-text-default': 'var(--foreground-inverted)',
	'--primary-btn-text-hover': 'var(--foreground-inverted)',
	'--primary-btn-text-pressed': 'var(--foreground-inverted)',
	'--primary-btn-text-disabled': 'var(--foreground-subtle)',
	'--primary-btn-background-default': 'var(--foreground-muted)',
	'--primary-btn-background-hover': 'var(--foreground-default)',
	'--primary-btn-background-pressed': 'var(--foreground-neutral)',
	'--primary-btn-background-disabled': 'var(--background-light)',
	'--primary-btn-border-radius': 'var(--rounded-full)',
	'--primary-btn-border': 'none',
	'--primary-btn-gap': 'var(--padding-2)',
	'--primary-btn-font-weight': 'var(--font-weight-medium)',
	'--primary-btn-font-size': 'var(--font-size-sm)',

	/* Icon Button (Namespace: --icn-btn-) */
	'--icn-btn-radius': 'var(--rounded-full)',
	'--icn-btn-padding': 'var(--padding-2) var(--padding-0-5)',
	'--icn-btn-background': 'var(--background-light)',
	'--icn-btn-background-hover': 'var(--background-subtle)',
	'--icn-btn-background-pressed': 'var(--background-muted)',
	'--icn-btn-background-disabled': 'var(--background-light)',
	'--icn-btn-icon-width': 'var(--icn-width)',
	'--icn-btn-icon-height': 'var(--icn-height)',
	'--icn-btn-color': 'var(--icn-color)',
	// '--icn-btn-color-hover': 'var(--foreground-default)', unused
	// '--icn-btn-color-pressed': 'var(--foreground-default)', unused
	// '--icn-btn-color-disabled': 'var(--foreground-subtle)', unused

	/* Select Menu – Dropdown Menu and List Item (Namespace: --li-) */
	'--dropdown-padding': 'var(--padding-2)',
	'--dropdown-border-radius': 'var(--rounded-xl)',
	'--dropdown-background': 'var(--background-neutral)',
	'--dropdown-color': 'var(--foreground-default)',
	'--dropdown-max-height': 'var(--height-128)',
	'--dropdown-gap': 'var(--padding-0)',
	'--li-height': 'var(--height-8)',
	'--li-padding': 'var(--padding-2)',
	'--li-radius': 'var(--rounded-lg)',
	'--li-label-padding': 'var(--padding-0) var(--padding-2)',
	'--li-label-family': 'var(--font-default)',
	'--li-label-size': 'var(--font-size-xs)',
	'--li-label-weight': 'var(--font-weight-medium)',
	'--li-label-line-height': 'var(--font-height-sm)',
	'--li-label-color': 'var(--foreground-default)',
	'--li-label-color-hover': 'var(--foreground-default)',
	'--li-label-color-pressed': 'var(--foreground-default)',
	'--li-label-color-disabled': 'var(--foreground-neutral)',
	'--li-icn-width': 'var(--icn-width)',
	'--li-icn-height': 'var(--icn-height)',
	'--li-icn-color': 'var(--foreground-default)',
	'--li-gap': 'var(--padding-2)',
	'--li-search-background': 'var(--background-default)',
	'--li-search-background-hover': 'var(--background-subtle)',

	/* Select Menu Dropdown Button (Namespace: --dropdown-button-) */
	/* Used for single, multi-select, and other dropdown buttons */
	'--dropdown-button-height': '40px',
	'--dropdown-button-padding': 'var(--padding-3)',
	'--dropdown-button-gap': 'var(--padding-2)',
	'--dropdown-button-border-radius': 'var(--border-radius-default)',
	'--dropdown-button-border': 'var(--border-default)',
	'--dropdown-button-background': 'var(--background-neutral)',
	'--dropdown-button-color': 'var(--foreground-default)',
	'--dropdown-button-hover-background': 'var(--background-default)',
	'--dropdown-button-hover-border': '1px solid var(--background-muted)',
	'--dropdown-button-pressed-background': 'var(--background-light)',
	'--dropdown-button-pressed-border': '1px solid var(--background-muted)',
	'--dropdown-button-font-family': 'var(--font-default)',
	'--dropdown-button-font-size': 'var(--font-size-xs)',
	'--dropdown-button-font-weight': 'var(--font-weight-medium)',

	/* Card - Control Surface */
	'--control-surface-gap': 'var(--padding-4)',

	/* Card – Surface (Namespace: --surface-) */
	'--surface-background': 'var(--background-default)',
	'--surface-padding': 'var(--padding-8)',
	'--surface-gap': 'var(--padding-8)',
	'--surface-radius': 'var(--rounded-3xl)',
	'--surface-font-family': 'var(--font-default)',

	/* Card Header (Namespace: --card-header-) */
	'--card-header-gap': 'var(--padding-1)',
	'--card-header-content-gap': 'var(--padding-4)',

	/* Card Title (Namespace: --card-title-) */
	'--card-title-family': 'var(--font-default)',
	'--card-title-size': 'var(--font-size-default)',
	'--card-title-weight': 'var(--font-weight-bold)',
	'--card-title-line-height': 'var(--font-height-lg)',
	'--card-title-color': 'var(--foreground-default)',
	'--card-title-align': ' var(--text-align-default)',

	/* Card Subtitle (Namespace: --card-subtitle-) */
	'--card-subtitle-family': 'var(--font-default)',
	'--card-subtitle-size': 'var(--font-size-sm)',
	'--card-subtitle-weight': 'var(--font-weight-medium)',
	'--card-subtitle-line-height': 'var(--font-height-md)',
	'--card-subtitle-color': 'var(--foreground-muted)',
	'--card-subtitle-align': 'var(--text-align-default)',

	/* Card Spinner (Namespace: --card-spinner-) */
	'--card-spinner-width': 'var(--width-6)',
	'--card-spinner-height': 'var(--height-6)',
	'--card-spinner-color': 'var(--foreground-default)',

	/* Card Error (Namespace: --card-error-) */
	'--card-message-gap': 'var(--padding-3)',
	'--card-message-icon-width': 'var(--icn-width)',
	'--card-message-icon-height': 'var(--icn-height)',
	'--card-error-icon-color': 'var(--foreground-error)',
	'--card-error-family': 'var(--font-default)',
	'--card-message-family': 'var(--font-default)',
	'--card-message-default-color': 'var(--foreground-default)',
	'--card-message-size': 'var(--font-size-sm)',
	'--card-message-weight': 'var(--font-weight-medium)',
	'--card-message-line-height': 'var(--font-height-md)',
	'--card-error-color': 'var(--foreground-error)',

	/* Chart Essentials - Fonts*/
	// TODO: These are currently unused - to decide: set the chartJS defaults?
	// '--chart-font-family-default': 'var(--font-default)',
	// '--chart-font-weight-default': 'var(--font-weight-medium)',
	// '--chart-font-size-default': 'var(--text-xs)',
	// '--chart-font-color-default': 'var(--foreground-default)',

	/* Chart Essentials – Category Legend Indicator (Namespace: --cat-indicator-) */
	'--cat-indicator-width': 'var(--width-2)',
	'--cat-indicator-height': 'var(--height-2)',

	/* Category Name (Namespace: --cat-name-) */
	'--cat-name-family': 'var(--font-default)',
	'--cat-name-size': 'var(--font-size-xs)',
	'--cat-name-weight': 'var(--font-weight-medium)',
	'--cat-name-color': 'var(--foreground-muted)',

	/* Chart Label (Namespace: --chart-label-) */
	'--chart-label-padding-top': 'var(--padding-0-5)',
	'--chart-label-padding-bottom': 'var(--padding-0-5)',
	'--chart-label-padding-left': 'var(--padding-0-5)',
	'--chart-label-padding-right': 'var(--padding-0-5)',
	'--chart-label-background': 'var(--background-neutral)',
	'--chart-label-radius': 'var(--rounded-full)',
	'--chart-label-family': 'var(--font-default)',
	'--chart-label-size': 'var(--font-size-xs)',
	'--chart-label-weight': 'var(--font-weight-medium)',
	'--chart-label-color': 'var(--foreground-default)',

	/* Chart Tooltip (Namespace: --chart-tooltip-) */
	'--chart-tooltip-padding': 'var(--padding-4)',
	'--chart-tooltip-radius': 'var(--rounded-xl)',
	'--chart-tooltip-gap': 'var(--padding-2)',
	'--chart-tooltip-background': 'var(--background-inverted)',
	'--chart-tooltip-title-family': 'var(--font-default)',
	'--chart-tooltip-title-size': 'var(--font-size-xs)',
	'--chart-tooltip-title-weight': 'var(--font-weight-bold)',
	'--chart-tooltip-title-color': 'var(--foreground-inverted)',
	'--chart-tooltip-title-align': 'var(--text-align-default)',
	'--chart-tooltip-category-family': 'var(--font-default)',
	'--chart-tooltip-category-size': 'var(--font-size-xs)',
	'--chart-tooltip-category-weight': 'var(--font-weight-medium)',
	'--chart-tooltip-category-color': 'var(--foreground-inverted)',
	'--chart-tooltip-category-align': 'var(--text-align-default)',

	/* Radio Button (Namespace: --radio-) */
	'--radio-width': 'var(--width-4)',
	'--radio-height': 'var(--height-4)',
	'--radio-color-unselected': 'var(--foreground-default)',
	'--radio-color-selected': 'var(--foreground-default)',
	'--radio-color-unselected-disabled': 'var(--foreground-subtle)',
	'--radio-color-selected-disabled': 'var(--foreground-subtle)',

	/* Checkbox (Namespace: --checkbox-) */
	'--checkbox-width': 'var(--width-4)',
	'--checkbox-height': 'var(--height-4)',
	'--checkbox-color-unselected': 'var(--foreground-default)',
	'--checkbox-color-selected': 'var(--foreground-default)',
	'--checkbox-color-unselected-disabled': 'var(--foreground-subtle)',
	'--checkbox-color-selected-disabled': 'var(--foreground-subtle)',

	/* Pie & Donut – Donut Number (Namespace: --donut-number-) */
	'--donut-number-family': 'var(--font-default)',
	'--donut-number-size': 'var(--font-size-4xl)',
	'--donut-number-weight': 'var(--font-weight-bold)',
	'--donut-number-color': 'var(--foreground-default)',

	/* Donut Measure Label (Namespace: --donut-dimension-) */
	'--donut-label-family': 'var(--font-default)',
	'--donut-label-size': 'var(--font-size-default)',
	'--donut-label-weight': 'var(--font-weight-medium)',
	'--donut-label-color': 'var(--foreground-muted)',
};

export const cssVariables: Record<string, string> = {
	...baseVariables,
	...semanticVariables,
	...componentVariables,
};
