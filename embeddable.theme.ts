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
		'--background-default': '#111',
		'--background-inverted': '#fafafa',
		'--background-neutral': '#222',
		'--foreground-default': '#fff',
		'--foreground-inverted': '#111',
		'--foreground-muted': '#fff',
		'--border-radius-default': '0px',
		'--background-light': '#333',
		'--icn-color': '#fafafa',
		'--background-subtle': '#444',
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
