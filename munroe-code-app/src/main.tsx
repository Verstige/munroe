import React from 'react'
import ReactDOM from 'react-dom/client'
import MunroeApp from './App'
import { MunroeErrorBoundary } from './ErrorBoundary'
import './styles.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MunroeErrorBoundary>
      <MunroeApp />
    </MunroeErrorBoundary>
  </React.StrictMode>,
)
