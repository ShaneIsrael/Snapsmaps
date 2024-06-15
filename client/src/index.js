import { createRoot } from 'react-dom/client'

import { NextUIProvider } from '@nextui-org/react'
import { Toaster } from 'sonner'
import App from './App'
import './index.css'
import 'react-lazy-load-image-component/src/effects/blur.css'
import 'react-lazy-load-image-component/src/effects/opacity.css'

const rootElement = document.getElementById('root')
const root = createRoot(rootElement)

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/service-worker.js')
    .then((registration) => {
      console.log('Service Worker registered with scope:', registration.scope)
    })
    .catch((error) => {
      console.error('Service Worker registration failed:', error)
    })
}

root.render(
  <NextUIProvider>
    <main className="dark text-foreground bg-background">
      <Toaster position="top-center" richColors />
      <App />
    </main>
  </NextUIProvider>,
)
