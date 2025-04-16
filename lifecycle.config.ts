//
// LifeCycle.config.ts
// •	Handles global theming logic (e.g. setting fonts, applying CSS variables).
// •	Uses the onThemeUpdated hook.
// •	Called only when the theme updates (e.g. when new theme passed in via clientContext).
// •	Receives the new theme as an argument.
// •	Returns a cleanup function to remove applied styles (e.g. fonts, variables).


export default {
    onThemeUpdated: (newTheme:any) => {

        console.log("new theme", newTheme);
        
        const cssVariables = generateCssVariables(newTheme.styles);
        const style = document.createElement('style');
        style.textContent = `:root {\n${cssVariables}}`;
        style.id = 'embeddable-style';

        const styleElement = document.getElementById('embeddable-style');

        if (!styleElement) {
            document.head.appendChild(style);
        }      
  
        // Cleanup: remove the styles/fonts when the component is unmounted / re-rendered
        return () => {            
            if (styleElement) {
                styleElement.remove();
            }        
        };
    },
};


const generateCssVariables = (variables: Record<string, string>) => {
    let textContent = '';
    Object.keys(variables).forEach((key) => {
        const value = variables[key];
        textContent += `${key}: ${value};\n`
    })
    return textContent;
}
