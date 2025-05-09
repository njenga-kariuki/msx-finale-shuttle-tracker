import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173 // Optional: ensure Vite uses this port if not overridden by CLI
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
