import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { RestaurantProvider } from './context/RestaurantContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <RestaurantProvider>
        <App />
      </RestaurantProvider>
    </BrowserRouter>
  </StrictMode>,
)