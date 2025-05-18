import { HeroUIProvider } from '@heroui/react'
import { createRoot } from 'react-dom/client'
import { Toaster } from 'sonner'
import App from './App'
import './index.css'
import 'react-lazy-load-image-component/src/effects/blur.css'
import 'react-lazy-load-image-component/src/effects/opacity.css'
import 'leaflet/dist/leaflet.css'

const rootElement = document.getElementById('root')
const root = createRoot(rootElement)

root.render(
  <HeroUIProvider>
    <main className='dark bg-background text-foreground'>
      <Toaster position="top-center" richColors />
      <App />
    </main>
  </HeroUIProvider>,
)
