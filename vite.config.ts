
import svgr from 'vite-plugin-svgr'

  base: '/Website/',  // Match your repo name (case-sensitive)
  plugins: [react(), tsconfigPaths(), svgr()],
})