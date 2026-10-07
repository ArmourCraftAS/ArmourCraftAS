import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  cacheDir: './.vite',
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 1600
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'framer-motion',
      'lucide-react',
      'three',
      '@react-three/fiber',
      '@react-three/drei'
    ]
  },
  resolve: {
    dedupe: ['react', 'react-dom']
  }
})
