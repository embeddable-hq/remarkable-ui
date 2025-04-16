// embeddable.theme.ts
// 	- Contains a themeProvider function.
// 	- themeProvider takes clientContext and parentTheme as arguments.
// 	- It’s first called by the parent component library (e.g. Remarkable UI) and then the Boiler Plate library.
// 	- In this library it simply returns the default theme. 
//  - In the Boiler Plate library, it merges the client theme with the parent theme and returns that. 
//  - The merged theme is returned at the component level by the useTheme() react hook.

import { mergician } from 'mergician';
import remarkableTheme from './src/themes/remarkableTheme/remarkableTheme';
import { DropdownItem } from './src/remarkable-ui/shared/Dropdown';
import { DataResponse } from '@embeddable.com/core';

const themeProvider = (clientContext: any, parentTheme:any): any => {

    //test overrides
    const darkModeVariables = {
        // '--background-default': '#111',
        // '--foreground-default': '#fff',
        // '--foreground-muted': '#fff',
        // '--background-neutral': '#222',
    }

    //test custom format function
    const customFormatFunction = (value:any) => {
        return value + "wooop!"
    }

    const customExportOptions: DropdownItem[] = [
        {
            id: "testOption",
            label: "Test Option",
            onClick: (data: DataResponse["data"]) => { alert("test option!") }
        }
    ]

    const testTheme = {
        //styles: darkModeVariables
        //customFormatFunction: customFormatFunction
        customExportOptions: customExportOptions
    }

    return mergician(remarkableTheme, testTheme);
};

export default themeProvider;