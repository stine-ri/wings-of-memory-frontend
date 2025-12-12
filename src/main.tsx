// main.tsx - UPDATED
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'

// REMOVE this empty import: import './index.css'
// Since all CSS is in App.css, just import App.css:
import './App.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)