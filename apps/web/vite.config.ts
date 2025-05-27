// Vite config for Tailwind CSS v3
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      // TODO: Remove this as it should work like other packages
      '@mini-wallet/hooks': resolve(__dirname, '../../packages/hooks/src/index.ts'),
      '@mini-wallet/hooks/*': resolve(__dirname, '../../packages/hooks/src/*'),
    },
  },
});
