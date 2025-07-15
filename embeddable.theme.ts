// embeddable.theme.ts
// 	- Contains a themeProvider function.
// 	- themeProvider takes clientContext and parentTheme as arguments.
// 	- It’s first called by the parent component library (e.g. Remarkable UI) and then the Boiler Plate library.
// 	- In this library it simply returns the default theme.
//  - In the Boiler Plate library, it merges the client theme with the parent theme and returns that.
//  - The merged theme is returned at the component level by the useTheme() react hook.

import { defineTheme } from '@embeddable.com/core';
import parentTheme from './src/themes/remarkableTheme/remarkableTheme';
import { ExportConfig, ExportOption } from './src/remarkable-ui/shared/ExportButton/nativeOptions';
import { Theme } from './src/themes/remarkableTheme/theme';
import { de } from './src/themes/translations/de';

export type ClientContext = {
	locale?: string; // e.g. 'en-US'
	theme?: 'dark' | 'light'
}

const themeProvider = (clientContext: ClientContext): any => {
	//Test. TODO: Remove this later.
	const theme = clientContext.theme;

	//test overrides
	const darkModeVariables = {
		'--em-background-default': '#111',
		'--em-background-inverted': '#fafafa',
		'--em-background-neutral': '#222',
		'--em-foreground-default': '#fff',
		'--em-foreground-inverted': '#111',
		'--em-foreground-muted': '#fff',
		'--em-border-radius-default': '0px',
		'--em-background-light': '#333',
		'--em-icn-color': '#fafafa',
		'--em-background-subtle': '#444',
	};

	//test custom format function
	const customFormatFunction = (value: any) => {
		return value + 'wooop!';
	};

	//test custom number function
	const customNumberFormatFunction = (value: any) => {
		return value + 'nuuumber!';
	};

	const customExportOptions: ExportOption[] = [
		{
			id: 'testOption',
			label: 'Test Option',
			fn: (config: ExportConfig) => {
				console.log('config', config);
			},
		},
	];

	return defineTheme<Theme>(parentTheme, {
		styles: {
			...(theme === 'dark' ? darkModeVariables : {}),
		},
		i18n: {
			preferredLocales: [clientContext.locale],
			translations: {
				...parentTheme.i18n.translations,
				de
			}
		}
		// customRelativeDateRanges: {
		// 	today: {
		// 		enabled: false,
		// 	},
		// },
		// charts: {
		//     legendPosition: 'right'
		// },
		//customFormatFunction: customFormatFunction,
		// customNumberFormatFunction: customNumberFormatFunction,
		// customExportOptions: customExportOptions,
	});
};

export default themeProvider;
