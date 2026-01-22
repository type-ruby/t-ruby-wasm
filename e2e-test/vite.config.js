import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5173,
    headers: {
      // WASM 실행에 필요한 COOP/COEP 헤더
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
  optimizeDeps: {
    exclude: ['@ruby/3.4-wasm-wasi', '@ruby/wasm-wasi'],
  },
});
