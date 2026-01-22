// src/components/ErrorBoundary.tsx
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });

    // Log error to console in development
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught an error:', error);
      console.error('Component stack:', errorInfo.componentStack);
    }

    // Prepare error data for reporting
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
    };

    // Log to browser console for debugging
    console.error('[ErrorBoundary] Error captured:', errorData);

    // TODO: Sentry integration
    // If you add Sentry, uncomment and configure:
    // import * as Sentry from '@sentry/react';
    // Sentry.captureException(error, { extra: errorData });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-4">
          <div className="max-w-lg w-full text-center">
            {/* Error Icon */}
            <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center border border-red-500/30">
              <AlertTriangle className="w-10 h-10 text-red-400" aria-hidden="true" />
            </div>

            {/* Error Title */}
            <h1 className="font-montserrat font-bold text-3xl text-white mb-4">
              Une erreur est survenue
            </h1>

            {/* Error Description */}
            <p className="font-inter text-white/70 text-lg mb-8 leading-relaxed">
              Nous sommes désolés, quelque chose s'est mal passé.
              Veuillez réessayer ou retourner à la page d'accueil.
            </p>

            {/* Error Details (development only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-left">
                <p className="font-mono text-red-400 text-sm mb-2">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <pre className="font-mono text-red-300/60 text-xs overflow-auto max-h-32">
                    {this.state.errorInfo.componentStack}
                  </pre>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleReload}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-inter font-medium rounded-xl hover:from-violet-500 hover:to-fuchsia-500 transition-all duration-300"
              >
                <RefreshCw className="w-5 h-5" aria-hidden="true" />
                <span>Réessayer</span>
              </button>

              <button
                onClick={this.handleGoHome}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/10 border border-white/20 text-white font-inter font-medium rounded-xl hover:bg-white/20 transition-all duration-300"
              >
                <Home className="w-5 h-5" aria-hidden="true" />
                <span>Retour à l'accueil</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
