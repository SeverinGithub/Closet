import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // relative asset paths — works at the domain root and in a subfolder
  base: './',
  plugins: [react()],
  server: { open: true },
});
