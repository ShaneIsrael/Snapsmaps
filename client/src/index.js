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
  window.addEventListener('load', function () {
    navigator.serviceWorker
      .register('/worker.js')
      .then(
        function (registration) {
          console.log('Worker registration successful', registration.scope)
        },
        function (err) {
          console.log('Worker registration failed', err)
        },
      )
      .catch(function (err) {
        console.log(err)
      })
  })
} else {
  console.log('Service Worker is not supported by browser.')
}

root.render(
  <NextUIProvider>
    <main className="dark text-foreground bg-background">
      <Toaster position="top-center" richColors />
      <App />
    </main>
  </NextUIProvider>,
)
