import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:7082',
        changeOrigin: true,
        secure: false, // Needed for self-signed certificates
        rewrite: (path) => path,
        configure: (proxy, options) => {
          // Add error handling to proxy
          proxy.on('error', (err, req, res) => {
            console.log('Proxy error:', err);
            // Return a 503 Service Unavailable
            res.writeHead(503, {
              'Content-Type': 'application/json',
            });
            res.end(JSON.stringify({ 
              error: 'Service unavailable', 
              message: 'Backend server is not running' 
            }));
          });
        },
        timeout: 2000 // Reduce timeout to 2 seconds
      }
    },
    port: 5173,
    strictPort: false,
    host: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          animations: ['framer-motion'],
        },
        assetFileNames: (assetInfo) => {
          let extType = assetInfo.name.split('.').at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(extType)) {
            extType = 'img';
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
      },
    },
  },
})
