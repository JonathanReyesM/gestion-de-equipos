const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  transpileDependencies: true,
  pwa: {
    name: 'gestion-de-equipos',
    manifest: {
      name: 'gestion-de-equipos',
      short_name: 'gestion-de-equipos',
      start_url: '/',
      icons: [
        {
          src: '/favicon.png',
          sizes: '16x16 32x32 48x48 64x64 96x96 128x128 256x256 512x512',
        },
      ],
    },
  },
});
