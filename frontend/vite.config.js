import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          // All remark/rehype + katex together to avoid circular chunk warnings
          markdown: ['react-markdown', 'remark-gfm', 'remark-math', 'rehype-katex', 'katex', 'rehype-sanitize', 'rehype-highlight', 'highlight.js'],
          mermaid: ['mermaid'],
        },
      },
    },
  },
});
