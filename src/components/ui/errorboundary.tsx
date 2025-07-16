import React, { Component, ErrorInfo, ReactNode } from 'react'

export type FallbackRender = (error: Error, info: ErrorInfo | null) => ReactNode

interface ErrorBoundaryProps {
  fallback?: ReactNode | FallbackRender
  children?: ReactNode
}

interface ErrorBoundaryState {
  error: Error | null
  info: ErrorInfo | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null, info: null }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({ error, info })
    if (process.env.NODE_ENV !== 'production') {
      console.error('ErrorBoundary caught an error', error, info)
    }
  }

  render() {
    const { error, info } = this.state
    const { fallback, children } = this.props

    if (error) {
      if (fallback) {
        if (typeof fallback === 'function') {
          return (fallback as FallbackRender)(error, info)
        }
        return fallback
      }

      return (
        <div role="alert" className="error-boundary">
          <h2>Something went wrong.</h2>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{error.message}</pre>
          {error.stack && (
            <details style={{ whiteSpace: 'pre-wrap' }}>
              <summary>Stack Trace</summary>
              {error.stack}
            </details>
          )}
          {info?.componentStack && (
            <details style={{ whiteSpace: 'pre-wrap' }}>
              <summary>Component Stack</summary>
              {info.componentStack}
            </details>
          )}
        </div>
      )
    }

    return <>{children}</>
  }
}

export default ErrorBoundary
