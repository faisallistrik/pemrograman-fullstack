import './bootstrap'
import '../css/app.css'

import { createInertiaApp } from '@inertiajs/react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from './contexts/ThemeContext'

createInertiaApp({
  resolve: (name) => {
    const pages = import.meta.glob('./InertiaPages/**/*.jsx', { eager: true })
    return pages[`./InertiaPages/${name}.jsx`]
  },
  setup({ el, App, props }) {
    createRoot(el).render(
      <ThemeProvider>
        <App {...props} />
      </ThemeProvider>
    )
  },
})
