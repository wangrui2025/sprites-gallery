import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://wangrui2025.github.io',
  base: '/sprites-gallery',
  output: 'static',
  i18n: {
    defaultLocale: 'en',
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
});
