import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import federation from '@originjs/vite-plugin-federation'

const origin = process.env.VITE_CORS_ORIGIN || 'https://poli-vida-sana-88ur3fb7s-projectsvercelcols-projects.vercel.app'
const mfNutritionUrl = process.env.VITE_MF_NUTRITION_URL || 'https://poli-vida-sana-mf-nutrition.vercel.app/assets/remoteEntry.js'
const mfExerciseUrl = process.env.VITE_MF_EXERCISE_URL || 'https://poli-vida-sana-mf-exercise.vercel.app/assets/remoteEntry.js'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    federation({
      name: 'mf-metrics',
      filename: 'remoteEntry.js',
      exposes: {
        './Dashboard': './src/Dashboard.tsx',
        './ProgressPage': './src/ProgressPage.tsx',
      },
      remotes: {
        'mf-nutrition': mfNutritionUrl,
        'mf-exercise': mfExerciseUrl,
      },
      shared: ['react', 'react-dom', 'zustand', 'recharts', 'react-router-dom']
    })
  ],
  build: {
    target: 'esnext', minify: false,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  css: {
    devSourcemap: true
  },
  server: {
    origin
  }
})