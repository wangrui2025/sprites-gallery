import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import sitemap from '@astrojs/sitemap';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  site: 'https://wangrui2025.github.io',
  base: '/sprites-gallery',
  output: 'static',

  prefetch: {
    prefetchAll: false,
    defaultStrategy: 'viewport',
  },

  i18n: {
    defaultLocale: 'zh',
    locales: ['en', 'zh'],
    routing: {
      prefixDefaultLocale: false,
    },
  },

  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },

  integrations: [sitemap()],
});