import { createRoot } from 'react-dom/client'

import { NextUIProvider } from '@nextui-org/react'
import App from './App'
import './index.css'

const rootElement = document.getElementById('root')
const root = createRoot(rootElement)

root.render(
  <NextUIProvider>
    <main className="dark text-foreground bg-background">
      <App />
    </main>
  </NextUIProvider>,
)
