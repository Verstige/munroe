import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // Desktop app: prefer correctness over tiny bundles.
    // Identifier mangling previously collided with React internals
    // (App→Ne, ErrorBoundary→Pe) and produced runtime crashes.
    minify: false,
  },
})
