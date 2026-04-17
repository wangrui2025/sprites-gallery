import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://wangrui2025.github.io',
  base: '/from-name',
  output: 'static',
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
});
