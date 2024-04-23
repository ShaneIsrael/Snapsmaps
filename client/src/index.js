import { createRoot } from 'react-dom/client'

import { NextUIProvider } from '@nextui-org/react'
import { Toaster } from 'sonner'
import App from './App'
import './index.css'
import 'react-lazy-load-image-component/src/effects/blur.css'
import 'react-lazy-load-image-component/src/effects/opacity.css'

const rootElement = document.getElementById('root')
const root = createRoot(rootElement)

root.render(
  <NextUIProvider>
    <main className="dark text-foreground bg-background">
      <Toaster position="top-center" richColors />
      <App />
    </main>
  </NextUIProvider>,
)
