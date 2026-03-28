import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/idea/',
  server: {
    proxy: {
      '/idea/api/ideas': {
        target: 'https://api.github.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/idea\/api\/ideas\/(\d+)$/, '/repos/spydmobile/idea/issues/$1'),
      },
    },
  },
});
