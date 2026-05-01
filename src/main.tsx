import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { seedDemoApril2026IfEmpty, seedDemoWeekIfEmpty } from './lib/seedDemo'
import { ErrorBoundary } from './components/ErrorBoundary'

void seedDemoWeekIfEmpty().catch(() => {})
void seedDemoApril2026IfEmpty().catch(() => {})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>,
)
