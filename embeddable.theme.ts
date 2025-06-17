// embeddable.theme.ts
// 	- Contains a themeProvider function.
// 	- themeProvider takes clientContext and parentTheme as arguments.
// 	- It’s first called by the parent component library (e.g. Remarkable UI) and then the Boiler Plate library.
// 	- In this library it simply returns the default theme.
//  - In the Boiler Plate library, it merges the client theme with the parent theme and returns that.
//  - The merged theme is returned at the component level by the useTheme() react hook.

import { DataResponse, defineTheme } from '@embeddable.com/core';
import remarkableTheme from './src/themes/remarkableTheme/remarkableTheme';
import { DropdownItem } from './src/remarkable-ui/shared/BaseDropdown';

const themeProvider = (clientContext: any, parentTheme: any): any => {
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

	const customExportOptions: DropdownItem[] = [
		{
			id: 'testOption',
			label: 'Test Option',
			onClick: (data: DataResponse['data']) => {
				alert('test option!');
			},
		},
	];

	const testTheme = {
		styles: {
			...(theme === 'dark' ? darkModeVariables : {}),
		},
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
		//customExportOptions: customExportOptions,
	};

	return defineTheme(remarkableTheme, testTheme);
};

export default themeProvider;
