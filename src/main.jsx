import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { CmsProvider } from './lib/cmsContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <CmsProvider>
        <App />
      </CmsProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)
