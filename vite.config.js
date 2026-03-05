import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve, extname, basename } from 'path';

export default defineConfig({
  base: './',
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    '__DEV__': false,
  },
  plugins: [
    react(),
    tailwindcss(),
  ],
  esbuild: {
    drop: ['console', 'debugger'],
    minifyWhitespace: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    legalComments: 'none',
    target: 'esnext',
    pure: ['createElement', 'forwardRef', 'memo'], 
  },
  build: {
    minify: 'esbuild',
    assetsInlineLimit: 0,
    modulePreload: false,
    reportCompressedSize: false,
    rollupOptions: {
      input: {
        main:               resolve(__dirname, 'index.html'),
      },
      output: {
        compact: true,
        manualChunks(id) {
          if (id.includes('node_modules')) return 'v';
          if (id.includes('src/translations')) return 't-' + basename(id, extname(id));
        },
        entryFileNames: '[hash].js',
        chunkFileNames: '[hash].js',
        assetFileNames: '[hash].[ext]',
      },
    },
  },
});