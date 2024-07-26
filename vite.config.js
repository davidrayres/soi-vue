import {fileURLToPath, URL} from 'node:url'
import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {VitePWA} from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),

    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Scores Of Interest',
        short_name: 'SOI',
        description: 'Peer to Peer Wagers',
        background_color: 'whitesmoke',
        theme_color: 'whitesmoke',
        display: 'standalone',
        lang: 'en',
        start_url: '/',
        scope: '/',
        icons: [
          {src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png'},
          {src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png'},
          {src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable'},
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
