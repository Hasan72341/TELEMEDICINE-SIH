import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'

createRoot(document.getElementById('root')).render(
    <App />
)

// Register PWA Service Worker (auto-updates)
registerSW({ immediate: true })
