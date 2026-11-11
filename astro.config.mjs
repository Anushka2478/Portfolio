import { defineConfig } from 'astro/config';

// SITE and BASE_PATH are set by the GitHub Pages workflow.
// Locally the site runs at "/".
export default defineConfig({
  site: process.env.SITE || 'https://example.github.io',
  base: process.env.BASE_PATH || '/',
  trailingSlash: 'ignore',
  build: { format: 'directory' },
});
