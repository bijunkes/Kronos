import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [
    react(),
    svgr(),
  ],
  server: {
    port: 5173,       // força sempre a porta 5173
    strictPort: true, // se a 5173 estiver ocupada, o Vite não muda sozinho, ele dá erro
  },
});
