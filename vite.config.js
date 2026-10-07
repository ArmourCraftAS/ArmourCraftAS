import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function apiResetPasswordPlugin() {
  return {
    name: 'api-reset-password',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (
          (req.url === '/api/admin/reset-password' || req.url === '/api/admin/send-reset-email') &&
          req.method === 'POST'
        ) {
          let body = ''
          req.on('data', (chunk) => {
            body += chunk
          })
          req.on('end', async () => {
            try {
              const { email, resetUrl } = JSON.parse(body || '{}')
              if (resetUrl) {
                console.log('RESET LINK:', resetUrl)
              }
              const { sendPasswordResetEmail } = await import('./lib/emailService.js')
              const result = await sendPasswordResetEmail({ to: email, resetUrl })
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify(result))
            } catch (err) {
              res.statusCode = 500
              res.setHeader('Content-Type', 'application/json')
              res.end(JSON.stringify({ success: false, error: err?.message || 'Server error' }))
            }
          })
          return
        }
        next()
      })
    }
  }
}

export default defineConfig({
  cacheDir: './.vite',
  server: {
    port: 3000
  },
  preview: {
    port: 3000
  },
  plugins: [react(), tailwindcss(), apiResetPasswordPlugin()],
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
