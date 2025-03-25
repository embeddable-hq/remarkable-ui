export function loadRootVariables() {
    const root = document.documentElement;
  
    const variables: Record<string, string> = {
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
        
        /* Font family */
        '--font-sans': "'Inter', sans-serif",
        
        /* Headings */
        '--text-4xl': '2rem',
        
        /* Body text */
        '--text-default': '1rem',
        '--text-sm': '0.875rem',
        '--text-xs': '0.75rem',
        
        /* Font weight */
        '--font-normal': '400',
        '--font-medium': '500',
        '--font-bold': '700',
        
        /* Padding */
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
        
        /* Margin */
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
        
        /* Height */
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
        
        /* Width */
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
        
        /* Border Radius */
        '--rounded-none': '0rem',
        '--rounded-sm': '0.125rem',
        '--rounded-default': '0.25rem',
        '--rounded-md': '0.375rem',
        '--rounded-lg': '0.5rem',
        '--rounded-xl': '0.75rem',
        '--rounded-2xl': '1rem',
        '--rounded-3xl': '2rem',
        '--rounded-full': '624.9375rem',
        
        /* Border Width */
        '--border-0': '0rem',
        '--border-default': '0.0625rem',
        '--border-2': '0.125rem',
        '--border-4': '0.25rem',
        
        /* Border Style */
        '--border-solid': 'solid',
        '--border-dashed': 'dashed',
        '--border-dotted': 'dotted',
        
        /* Shadow */
        '--default-shadow': '0px 1px 40px 0px rgba(33, 33, 41, 0.25)',
        
        /* Semantic */
        '--background-neutral': 'var(--gray-0)',
        '--background-default': 'var(--gray-50)',
        '--background-light': 'var(--gray-100)',
        '--background-subtle': 'var(--gray-200)',
        '--background-muted': 'var(--gray-300)',
        '--foreground-default': 'var(--gray-900)',
        '--foreground-muted': 'var(--gray-700)',
        '--foreground-subtle': 'var(--gray-400)'
    };
  
    Object.entries(variables).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }