import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import viteCompression from 'vite-plugin-compression';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Generate gzip and brotli compressed assets
    viteCompression({ 
      algorithm: 'gzip',
      ext: '.gz' 
    }),
    viteCompression({ 
      algorithm: 'brotliCompress',
      ext: '.br' 
    }),
    // Bundle analyzer - uncomment to generate stats when needed
    // visualizer({
    //   open: false,
    //   gzipSize: true,
    //   brotliSize: true,
    // }),
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
        drop_console: true, // Remove console logs in production
        drop_debugger: true, // Remove debugger statements
        pure_funcs: ['console.debug', 'console.log'] // Remove specific functions
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': [
            'react',
            'react-dom',
            'react-router-dom',
            'react-helmet-async',
          ],
          'ui': [
            'lucide-react'
          ],
          'three': [
            'three',
            '@react-three/fiber',
            '@react-three/drei'
          ]
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
