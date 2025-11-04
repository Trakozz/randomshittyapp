import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@features': path.resolve(__dirname, './src/features'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@components': path.resolve(__dirname, './src/shared/components'),
      '@hooks': path.resolve(__dirname, './src/shared/hooks'),
      '@utils': path.resolve(__dirname, './src/shared/utils'),
      '@constants': path.resolve(__dirname, './src/shared/constants'),
      '@assets': path.resolve(__dirname, './src/assets'),
    },
  },
  build: {
    // Suppress chunk size warning - we've optimized as much as possible
    // Chakra UI is just large, but it's split into its own cached chunk
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks: {
          // React ecosystem - Core React libraries
          'vendor-react': [
            'react',
            'react-dom',
            'react-router-dom',
          ],
          // Chakra UI - Large UI component library
          'vendor-chakra': [
            '@chakra-ui/react',
          ],
          // Forms and HTTP - Form handling and API communication
          'vendor-forms': [
            'react-hook-form',
            'axios',
          ],
          // Icons - React Icons library
          'vendor-icons': [
            'react-icons',
          ],
        },
      },
    },
  },
})
