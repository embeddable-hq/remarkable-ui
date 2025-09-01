import { defineConfig } from '@embeddable.com/sdk-core';
import react from '@embeddable.com/sdk-react';

export default defineConfig({
  plugins: [react],
  lifecycleHooksFile: './embeddable.lifecycle.ts',
  pushModels: false,
  region: 'US',
});
