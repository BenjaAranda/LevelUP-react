// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // --- AÑADIR ESTA SECCIÓN ---
  optimizeDeps: {
    include: ['react-icons/fa'], // Forzar a Vite a incluir este módulo
  },
  // --- AÑADIR ESTA SECCIÓN PARA VITEST ---
  test: {
    globals: true, // Permite usar 'describe', 'test', 'expect' sin importarlos
    environment: 'jsdom', // Simula el DOM del navegador
    setupFiles: './src/setupTests.js', // Archivo de configuración para testing-library (lo crearemos)
    // Opcional: Incluir archivos CSS en las pruebas (si afectan el renderizado)
    css: true, 
    // Opcional: Definir dónde buscar los archivos de prueba
    // include: ['src/__tests__/**/*.test.{js,jsx}'], // Vitest ya busca esto por defecto
  },
  // --------------------------
})