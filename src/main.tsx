import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/App'
import { TimezoneProvider } from './app/TimezoneProvider'
import './styles/globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode><TimezoneProvider><App /></TimezoneProvider></StrictMode>,
)
