import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Prevent esbuild from mangling top-level names into collisions with React
    // internals (e.g. App→Ne, ErrorBoundary→Pe overwriting unstable_now).
    // That produced "l is not a function" / blank error boundary on navigation.
    minify: 'esbuild',
  },
  esbuild: {
    minifyIdentifiers: false,
    minifySyntax: true,
    minifyWhitespace: true,
  },
})
