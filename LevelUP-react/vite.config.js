// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // --- AÑADIR ESTA SECCIÓN ---
  optimizeDeps: {
    include: ['react-icons/fa'], // Forzar a Vite a incluir este módulo
  },
  // --------------------------
})