import './index.css'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import Dashboard from './Dashboard'

const root = createRoot(document.getElementById('root')!)
root.render(
  <StrictMode>
    <BrowserRouter>
      <Dashboard onNavigate={(path) => window.location.href = path} />
    </BrowserRouter>
  </StrictMode>,
)