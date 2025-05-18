import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { VitePWA } from 'vite-plugin-pwa';
import viteCompression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    viteCompression({ algorithm: 'gzip' }),
    viteCompression({ algorithm: 'brotliCompress', ext: '.br' }),
    visualizer(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['**/*'],
      manifest: {
        name: 'Arxen Construction',
        short_name: 'Arxen',
        theme_color: '#1e40af',
        icons: [
          {
            src: 'https://i.postimg.cc/SNx9NN2x/Chat-GPT-Image-May-13-2025-12-34-23-PM-removebg-preview.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'https://i.postimg.cc/SNx9NN2x/Chat-GPT-Image-May-13-2025-12-34-23-PM-removebg-preview.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    cssCodeSplit: false, // Generate a single CSS file
    sourcemap: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['lucide-react', 'leaflet', 'react-leaflet'],
          utils: ['@emailjs/browser']
        }
      }
    }
  },
  server: {
    headers: {
      // Adjust Content Security Policy to allow necessary functionality
      'Content-Security-Policy': "default-src * 'unsafe-inline' 'unsafe-eval' data:; script-src * 'unsafe-inline' 'unsafe-eval'; connect-src * 'unsafe-inline'; img-src * data: blob:; frame-src *; style-src * 'unsafe-inline'; font-src * data:;"
    }
  }
});
