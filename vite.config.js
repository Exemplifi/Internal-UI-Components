import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'src/assets/dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/assets/js/main.js')
      },
      output: {
        entryFileNames: '[name].min.js',
        chunkFileNames: '[name]-[hash].min.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name.endsWith('.css')) {
            return 'style.min.css';
          }
          return '[name][extname]';
        }
      },
    },
    minify: true,
    sourcemap: true,
    // Disable CSS handling since we only want to process JS
    cssCodeSplit: false,
    cssMinify: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  // Remove CSS preprocessing options since we're not handling CSS
  assetsInclude: [
    '**/*.woff',
    '**/*.woff2',
    '**/*.ttf',
    '**/*.eot',
    '**/*.svg',
    '**/*.png',
    '**/*.jpg',
    '**/*.jpeg',
    '**/*.gif',
  ],
  server: {
    open: true,
  },
});