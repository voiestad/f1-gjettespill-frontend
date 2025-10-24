import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { ThemeProvider, CsrfTokenProvider } from './components'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <CsrfTokenProvider>
        <App />
      </CsrfTokenProvider>
    </ThemeProvider>
  </StrictMode>,
)
