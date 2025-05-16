import basicSsl from '@vitejs/plugin-basic-ssl'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default ({ mode }) => ({
  plugins: [react(), mode === 'development' && basicSsl(), svgr()].filter(Boolean),
  build: {
    outDir: 'build',
    sourcemap: false,
  },
})
