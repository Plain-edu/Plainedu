// vite.config.js
import { defineConfig }            from 'vite';
import react                       from '@vitejs/plugin-react';
import tailwindcss                 from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: '/',
  server: {
    proxy: {
      // /api 로 시작하는 모든 요청을 포워딩
      '/api': {
        target: 'http://localhost:4000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
