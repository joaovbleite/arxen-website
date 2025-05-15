import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Add React 19 compatibility settings
      babel: {
        plugins: [
          ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }]
        ]
      },
      jsxRuntime: 'automatic',
    }),
  ],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  // Add optimizations for build process
  build: {
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Improve chunk splitting
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Split React library code to separate vendor chunk
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react'
            }
            if (id.includes('lucide-react') || id.includes('react-router')) {
              return 'vendor-ui'
            }
            return 'vendor'
          }
        },
      },
    },
    // Add source maps for better error reporting
    sourcemap: true,
  },
  // Improve dev experience
  server: {
    host: true,
    strictPort: false,
    // Add proxy if you need API proxying
    /* proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }, */
    headers: {
      // Adjust Content Security Policy to allow necessary functionality
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: http:; connect-src 'self' https: http:; font-src 'self' data:;"
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    // Force include problematic libraries if needed
    // force: ['problematic-library']
  }
});
