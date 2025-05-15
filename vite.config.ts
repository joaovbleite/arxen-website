import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { visualizer } from 'rollup-plugin-visualizer';
import compress from 'vite-plugin-compression';

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
    // PWA plugin for service worker and manifest
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Arxen Construction',
        short_name: 'Arxen',
        theme_color: '#1e40af',
        icons: [
          {
            src: 'https://i.postimg.cc/SNx9NN2x/Chat-GPT-Image-May-13-2025-12-34-23-PM-removebg-preview.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'https://i.postimg.cc/SNx9NN2x/Chat-GPT-Image-May-13-2025-12-34-23-PM-removebg-preview.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'unsplash-images',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              }
            }
          },
          {
            urlPattern: /^https:\/\/i\.postimg\.cc\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'postimg-images',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              }
            }
          }
        ]
      }
    }),
    // Compression plugin for smaller bundle sizes
    compress({
      algorithm: 'brotliCompress',
      ext: '.br'
    }),
    // Bundle visualization for debugging
    process.env.ANALYZE === 'true' && visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: 'dist/stats.html'
    })
  ].filter(Boolean),
  
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  
  // Add optimizations for build process
  build: {
    // Target the correct browsers for better optimization
    target: ['chrome80', 'safari14', 'firefox78', 'edge90'],
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.debug', 'console.info']
      },
      output: {
        comments: false
      }
    },
    // Create minimal entries for faster loading
    modulePreload: {
      polyfill: true
    },
    // Improve chunk splitting
    rollupOptions: {
      output: {
        // Generate chunk names based on content for better caching
        manualChunks: (id) => {
          // App-specific chunks by main feature areas
          if (id.includes('/src/components/') && !id.includes('node_modules')) {
            // Group components by folder for better code splitting
            if (id.includes('/FreeEstimate/')) {
              return 'components-free-estimate';
            }
            return 'components-ui';
          }
          
          // Pages - keep separate for better code splitting and parallel loading
          if (id.includes('/src/pages/') && !id.includes('node_modules')) {
            // Group certain pages with similar dependencies
            if (id.includes('/pages/FreeEstimate/')) {
              return 'page-free-estimate';
            }
            
            // For other pages, create more granular chunks to allow parallel loading
            const pageName = id.split('/pages/')[1]?.split('/')[0];
            if (pageName) {
              return `page-${pageName.toLowerCase()}`;
            }
            
            return 'pages-other';
          }
          
          // Vendor chunks - group by major library categories
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('lucide-react') || id.includes('react-router')) {
              return 'vendor-ui';
            }
            if (id.includes('tailwind') || id.includes('postcss')) {
              return 'vendor-styling';
            }
            return 'vendor-other';
          }
          
          // Default chunk
          return 'index';
        },
        // Better chunk naming for improved caching
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Add source maps for better error reporting, but make them separate files
    sourcemap: true,
    // Improve CSS handling
    cssCodeSplit: true,
    // Generate preload directives for critical chunks
    cssMinify: true,
    // Analyze bundles in development
    reportCompressedSize: true,
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
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: http:; connect-src 'self' https: http:; font-src 'self' data: https://fonts.gstatic.com;"
    }
  },
  
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'lucide-react'],
    // Ensure dependencies are properly processed
    esbuildOptions: {
      target: 'es2020'
    }
  },
  
  // Enable faster builds
  esbuild: {
    // Use multi-threading for builds
    treeShaking: true,
    legalComments: 'none'
  },
  
  // Prevent CORS issues
  preview: {
    cors: true
  }
});
