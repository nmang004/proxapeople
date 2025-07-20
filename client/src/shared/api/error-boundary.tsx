import React, { Component, ReactNode } from 'react';
import { ApiError, NetworkError, ValidationError } from './client';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ApiErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('API Error Boundary caught an error:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.handleReset);
      }

      return (
        <DefaultErrorFallback 
          error={this.state.error} 
          reset={this.handleReset} 
        />
      );
    }

    return this.props.children;
  }
}

interface ErrorFallbackProps {
  error: Error;
  reset: () => void;
}

function DefaultErrorFallback({ error, reset }: ErrorFallbackProps) {
  const getErrorMessage = (error: Error): { title: string; message: string; actions: string[] } => {
    if (error instanceof ApiError) {
      switch (error.status) {
        case 401:
          return {
            title: 'Authentication Required',
            message: 'Your session has expired. Please log in again.',
            actions: ['Login', 'Retry'],
          };
        case 403:
          return {
            title: 'Access Denied',
            message: 'You don\'t have permission to access this resource.',
            actions: ['Go Back', 'Contact Support'],
          };
        case 404:
          return {
            title: 'Not Found',
            message: 'The requested resource could not be found.',
            actions: ['Go Back', 'Retry'],
          };
        case 429:
          return {
            title: 'Too Many Requests',
            message: 'You\'re making too many requests. Please wait and try again.',
            actions: ['Wait and Retry'],
          };
        case 500:
          return {
            title: 'Server Error',
            message: 'Something went wrong on our end. Please try again later.',
            actions: ['Retry', 'Contact Support'],
          };
        default:
          return {
            title: 'Request Failed',
            message: error.message || 'An unexpected error occurred.',
            actions: ['Retry', 'Refresh Page'],
          };
      }
    }

    if (error instanceof NetworkError) {
      return {
        title: 'Connection Problem',
        message: 'Unable to connect to the server. Please check your internet connection.',
        actions: ['Check Connection', 'Retry'],
      };
    }

    if (error instanceof ValidationError) {
      return {
        title: 'Validation Error',
        message: 'The data provided is invalid. Please check your input and try again.',
        actions: ['Fix Input', 'Reset Form'],
      };
    }

    return {
      title: 'Unexpected Error',
      message: error.message || 'An unexpected error occurred.',
      actions: ['Retry', 'Refresh Page'],
    };
  };

  const { title, message, actions } = getErrorMessage(error);

  const handleAction = (action: string) => {
    switch (action) {
      case 'Login':
        // Redirect to login page
        window.location.href = '/login';
        break;
      case 'Go Back':
        window.history.back();
        break;
      case 'Refresh Page':
        window.location.reload();
        break;
      case 'Contact Support':
        // Open support channel (email, chat, etc.)
        window.open('mailto:support@proxapeople.com', '_blank');
        break;
      case 'Retry':
      case 'Wait and Retry':
      case 'Check Connection':
      case 'Fix Input':
      case 'Reset Form':
      default:
        reset();
        break;
    }
  };

  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white border border-red-200 rounded-lg shadow-lg p-6 text-center">
        <div className="w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
          <svg
            className="w-6 h-6 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>
        
        <p className="text-sm text-gray-600 mb-6">
          {message}
        </p>

        {process.env.NODE_ENV === 'development' && (
          <details className="mb-4 text-left">
            <summary className="text-xs text-gray-500 cursor-pointer mb-2">
              Error Details (Development)
            </summary>
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto">
              {error.stack}
            </pre>
          </details>
        )}
        
        <div className="flex flex-col gap-2">
          {actions.map((action, index) => (
            <button
              key={action}
              onClick={() => handleAction(action)}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                index === 0
                  ? 'bg-red-600 text-white hover:bg-red-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {action}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Hook for using error boundary imperatively
export function useErrorHandler() {
  return (error: Error) => {
    // In a real implementation, you might want to report the error to a service
    console.error('Handled error:', error);
    
    // For now, just throw the error to be caught by the boundary
    throw error;
  };
}

// Higher-order component for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  return function WrappedComponent(props: P) {
    return (
      <ApiErrorBoundary {...errorBoundaryProps}>
        <Component {...props} />
      </ApiErrorBoundary>
    );
  };
}