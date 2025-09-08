import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: ['@radix-ui/react-slot'], // Indique à Rollup de ne pas essayer de bundler ce module
    },
  },
  server: {
    port: 5173,
  },
});
