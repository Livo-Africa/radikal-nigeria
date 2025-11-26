// src/components/shared/ErrorBoundary.tsx
'use client';
import { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, Home, MessageCircle } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log to your error tracking service (Sentry, LogRocket, etc.)
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
    
    // Production error logging (remove console in production if needed)
    if (process.env.NODE_ENV === 'development') {
      console.error('Application Error:', error, errorInfo);
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center border border-gray-200">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
                <RefreshCw className="w-10 h-10 text-red-500" />
              </div>
            </div>
            
            {/* Error Message */}
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Something Went Wrong
            </h2>
            <p className="text-gray-600 mb-6">
              We encountered an unexpected error. Don't worry, our team has been notified and we're working to fix it.
            </p>

            {/* Error Details (Development only) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 font-medium mb-2">
                  Technical Details
                </summary>
                <div className="bg-gray-50 rounded-lg p-3 text-xs font-mono text-gray-700 overflow-auto max-h-32">
                  {this.state.error.message}
                </div>
              </details>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={this.handleReset}
                className="w-full bg-[#D4AF37] text-black font-semibold py-3 rounded-xl hover:bg-[#b8941f] transition-colors flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </button>
              
              <button
                onClick={this.handleReload}
                className="w-full bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Reload Page</span>
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="w-full bg-gray-100 text-gray-700 font-semibold py-3 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2"
              >
                <Home className="w-4 h-4" />
                <span>Go Home</span>
              </button>

              {/* Support Link */}
              <div className="pt-4 border-t border-gray-200">
                <a 
                  href="https://wa.me/233207472307?text=Hi! I'm experiencing an error on the website"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#D4AF37] hover:text-[#b8941f] font-semibold text-sm flex items-center justify-center space-x-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Contact Support</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}