import React from 'react'
import ReactDOM from 'react-dom/client'
import BoibyBookAirConfigurator from './pages/BoibyBook-Air/BoibyBookAirConfigurator'
import './global.css'

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {error: any}> {
  state = { error: null }
  componentDidCatch(error: any) { this.setState({ error }) }
  render() {
    if (this.state.error) return <pre style={{color:'red'}}>{String(this.state.error)}</pre>
    return this.props.children
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <BoibyBookAirConfigurator />
  </ErrorBoundary>
)