import './css/style.css'
// Import components to register them as custom elements
// This registers <brand-logo>, <app-header>, <auto-scaler>, and <edge-app-devtools>
import '@screenly/edge-apps/components'
import init from './app'

document.addEventListener('DOMContentLoaded', init)
