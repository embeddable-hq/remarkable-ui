// embeddable.theme.ts
// 	- Contains a themeProvider function.
// 	- themeProvider takes clientContext and parentTheme as arguments.
// 	- It’s first called by the parent component library (e.g. Vanilla Components) and then the Boiler Plate library.
// 	- In this library it simply returns the default theme. 
//  - In the Boiler Plate library, it merges the client theme with the parent theme and returns that. 
//  - The merged theme is returned at the component level by the useTheme() react hook.

import remarkableTheme from './src/themes/remarkableTheme/remarkableTheme';

const themeProvider = (clientContext: any, parentTheme:any): any => {
    return remarkableTheme
};

export default themeProvider;