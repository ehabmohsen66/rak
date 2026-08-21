import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    open: false,
  },
  build: {
    modulePreload: {
      resolveDependencies(filename, deps, { hostId, hostType }) {
        return deps.filter(dep => 
          !dep.includes('spline') && 
          !dep.includes('three') && 
          !dep.includes('physics') && 
          !dep.includes('gaussian') && 
          !dep.includes('navmesh') && 
          !dep.includes('boolean') && 
          !dep.includes('opentype') && 
          !dep.includes('howler')
        );
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-motion': ['framer-motion'],
          'vendor-three': ['three'],
          'vendor-spline': ['@splinetool/react-spline', '@splinetool/runtime'],
        },
      },
    },
  },
})
