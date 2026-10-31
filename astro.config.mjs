// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://kolarikspeechtherapy.com',
  // Fetch pages on hover so navigation feels instant; Chromium browsers prerender them outright.
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover'
  },
  experimental: {
    clientPrerender: true
  },
  // The stylesheet is small, so inlining it saves a render-blocking request on first visit.
  build: {
    inlineStylesheets: 'always'
  },
  vite: {
    plugins: [tailwindcss()]
  }
});
