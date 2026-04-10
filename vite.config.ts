import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  base: '/website/',  // Match your repo name
  plugins: [react(), tsconfigPaths()],
})