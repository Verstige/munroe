import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    minify: 'esbuild',
  },
  esbuild: {
    minifyIdentifiers: false,
    minifySyntax: true,
    minifyWhitespace: true,
  },
});
