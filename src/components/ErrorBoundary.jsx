import React from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({ error, errorInfo })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#060a12] text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#0b1222] border border-red-500/30 rounded-2xl p-6 sm:p-8 text-center shadow-2xl">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-950/50 border border-red-500/40 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
            <p className="text-slate-400 text-xs sm:text-sm mb-6 leading-relaxed">
              An unexpected error occurred while rendering the page.
            </p>

            {this.state.error && (
              <div className="bg-[#060a14] border border-slate-800 rounded-lg p-3 mb-6 text-left overflow-auto max-h-32 text-xs font-mono text-red-300">
                {this.state.error.toString()}
              </div>
            )}

            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1762f0] hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shadow-lg shadow-blue-600/30"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reload Page</span>
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
