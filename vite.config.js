import { defineConfig } from 'vite';
import path from 'path';
import fs from 'fs';

// Get all JS files from src/assets/js directory
const jsDirectory = path.resolve(__dirname, 'src/assets/js');
const jsFiles = fs.readdirSync(jsDirectory)
  .filter(file => file.endsWith('.js'))
  .reduce((acc, file) => {
    const name = file.replace('.js', '');
    acc[name] = path.resolve(jsDirectory, file);
    return acc;
  }, {});

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'src/assets/dist',
    emptyOutDir: true,
    rollupOptions: {
      input: jsFiles,
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