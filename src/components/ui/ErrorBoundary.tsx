import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { Button } from './button'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center" role="alert">
          <h1 className="text-2xl font-bold text-destructive">Something went wrong</h1>
          <p className="max-w-md text-muted-foreground">
            An unexpected error occurred. Please try refreshing the page.
          </p>
          {this.state.error && (
            <pre className="max-w-lg overflow-auto rounded-md bg-muted p-4 text-left text-sm">
              {this.state.error.message}
            </pre>
          )}
          <Button onClick={this.handleReset}>Try Again</Button>
        </div>
      )
    }

    return this.props.children
  }
}
