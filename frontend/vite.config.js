import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['/vite.svg'],
      manifest: {
        name: 'Gramin Swasthya',
        short_name: 'Swasthya',
        description: 'Telemedicine platform for rural healthcare',
        theme_color: '#ff6b35',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: '/vite.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
          // Note: Add PNG icons (192x192, 512x512) in /public for full installability
        ]
      }
    })
  ],
  server: {
    host: true, // Allow access from network
    port: 5173
  }
})
