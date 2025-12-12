import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.tsx'  // App.tsx will NOT import CSS

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)