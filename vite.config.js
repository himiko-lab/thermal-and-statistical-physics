import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

/**
 * Dua target dari satu basis kode:
 *
 *   npm run build          -> dist/         disajikan lewat serve.py, kamera aktif
 *   npm run build:offline  -> dist-offline/ satu file HTML mandiri, tanpa kamera
 *
 * Kamera hanya jalan di secure context, dan file:// bukan salah satunya. Jadi
 * versi offline sengaja dibangun tanpa hand tracking: perannya cadangan kalau
 * kamera atau izinnya bermasalah di ruangan.
 */
export default defineConfig(({ mode }) => {
  const offline = mode === 'offline';

  return {
    base: './',
    // publicDir dimatikan untuk build offline supaya vendor/ (26 MB model
    // MediaPipe) tidak ikut, karena versi itu memang tidak memakainya.
    publicDir: offline ? false : 'public',
    plugins: [react(), tailwindcss(), ...(offline ? [viteSingleFile()] : [])],
    define: { __OFFLINE__: JSON.stringify(offline) },
    server: {
      // Samakan dengan serve.py: cross-origin isolation supaya runtime wasm
      // MediaPipe boleh memakai thread saat `npm run dev`.
      headers: {
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
      },
    },
    build: {
      outDir: offline ? 'dist-offline' : 'dist',
      emptyOutDir: true,
      assetsInlineLimit: offline ? Number.MAX_SAFE_INTEGER : 4096,
      target: 'es2022',
    },
  };
});
