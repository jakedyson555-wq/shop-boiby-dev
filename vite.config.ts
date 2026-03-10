import { defineConfig, transformWithEsbuild, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve, extname } from 'path';

function nodeModulesJsx(): Plugin {
  return {
    name: 'node-modules-jsx',
    async transform(code: string, id: string) {
      if (id.includes('node_modules') && extname(id) === '.js') {
        return transformWithEsbuild(code, id, { loader: 'jsx', jsx: 'automatic' });
      }
    },
  };
}

function nodeModulesTsx(): Plugin {
  return {
    name: 'node-modules-tsx',
    async transform(code: string, id: string) {
      if (id.includes('node_modules') && extname(id) === '.ts') {
        return transformWithEsbuild(code, id, { loader: 'tsx', jsx: 'automatic' });
      }
    },
  };
}

export default defineConfig({
  base: './',
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
    '__DEV__': false,
    'global': 'globalThis',
  },
  plugins: [
    nodeModulesJsx(),
    nodeModulesTsx(),
    react(),
    tailwindcss(),
  ],
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      'lucide-react',
    ],
    esbuildOptions: {
      loader: { '.js': 'jsx' },
      jsx: 'automatic',
    },
  },
  esbuild: {
    drop: ['console', 'debugger'],
    minifyWhitespace: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    legalComments: 'none',
    target: 'esnext',
  },
  build: {
    minify: 'esbuild',
    assetsInlineLimit: 0,
    modulePreload: false,
    reportCompressedSize: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        compact: true,
        entryFileNames: '[hash].js',
        chunkFileNames: '[hash].js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
});