import { defineConfig } from '@embeddable.com/sdk-core';
import react from '@embeddable.com/sdk-react';

export default defineConfig({
  plugins: [react],
  lifecycleHooksFile: './embeddable.lifecycle.ts',
  pushModels: false,
  previewBaseUrl: 'https://app.dev.embeddable.com',
  pushBaseUrl: 'https://api.dev.embeddable.com',
  audienceUrl: 'https://api.dev.embeddable.com/',
  authDomain: 'embeddable-dev.eu.auth0.com',
  authClientId: 'xOKco5ztFCpWn54bJbFkAcT8mV4LLcpG',
});
