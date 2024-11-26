import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/arabic-bible/', // Ensure this matches your repository name
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'icons/*.png'],
      manifest: {
        name: 'الكتاب المقدس العربي',
        short_name: 'الكتاب المقدس',
        description: 'تطبيق الكتاب المقدس باللغة العربية',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/arabic-bible/', // Ensure this matches your repository name
        scope: '/arabic-bible/', // Ensure this matches your repository name
        icons: [
          {
            src: '/arabic-bible/icons/icon-72x72.png',
            sizes: '72x72',
            type: 'image/png'
          },
          {
            src: '/arabic-bible/icons/icon-96x96.png',
            sizes: '96x96',
            type: 'image/png'
          },
          {
            src: '/arabic-bible/icons/icon-128x128.png',
            sizes: '128x128',
            type: 'image/png'
          },
          {
            src: '/arabic-bible/icons/icon-144x144.png',
            sizes: '144x144',
            type: 'image/png'
          },
          {
            src: '/arabic-bible/icons/icon-152x152.png',
            sizes: '152x152',
            type: 'image/png'
          },
          {
            src: '/arabic-bible/icons/icon-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: '/arabic-bible/icons/icon-384x384.png',
            sizes: '384x384',
            type: 'image/png'
          },
          {
            src: '/arabic-bible/icons/icon-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
