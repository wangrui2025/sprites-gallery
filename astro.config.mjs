import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://wangrui2025.github.io',
  base: '/sprites-gallery',
  output: 'static',
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
});
