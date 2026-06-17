import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// base must match the repo name for project Pages: daneburns.github.io/the-gib/
export default defineConfig({
  base: '/the-gib/',
  plugins: [react()],
})
