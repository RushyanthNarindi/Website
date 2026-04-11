import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  base: '/Website/',  // Match your repo name (case-sensitive)
  plugins: [react(), tsconfigPaths(), svgr()],
});