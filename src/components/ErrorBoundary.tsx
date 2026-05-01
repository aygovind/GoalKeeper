import type { ReactNode } from 'react'
import { Component } from 'react'

export class ErrorBoundary extends Component<
  { children: ReactNode },
  { error: Error | null }
> {
  state: { error: Error | null } = { error: null }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  componentDidCatch(error: Error) {
    // keep a console trace for debugging
    // eslint-disable-next-line no-console
    console.error('App crashed:', error)
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            minHeight: '100vh',
            background: '#0a0a0a',
            color: '#e5e7eb',
            padding: 24,
            fontFamily:
              'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
          }}
        >
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
            GoalKeeper crashed
          </div>
          <div style={{ opacity: 0.8, marginBottom: 12 }}>
            Open DevTools Console for full stack trace.
          </div>
          <pre
            style={{
              whiteSpace: 'pre-wrap',
              background: '#111',
              border: '1px solid #262626',
              borderRadius: 12,
              padding: 12,
              fontSize: 12,
              lineHeight: 1.4,
            }}
          >
            {this.state.error.message}
          </pre>
        </div>
      )
    }

    return this.props.children
  }
}

