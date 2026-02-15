import type { ReactNode, ErrorInfo } from "react";
import { ErrorBoundaryClass } from "./useErrorBoundary";
import "./ErrorBoundary.css";
import { Button } from "../button/Button";
import { Icon } from "../icon/Icon";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, errorInfo: ErrorInfo, reset: () => void) => ReactNode;
}

function DefaultErrorFallback({ error, errorInfo, reset }: { error: Error; errorInfo: ErrorInfo; reset: () => void }) {
  const isDev = import.meta.env.DEV;
  const stackLines = errorInfo.componentStack?.split("\n").filter((line) => line.trim()) || [];

  if (!isDev) {
    return (
      <div className='error-boundary' role='alert' data-component='ErrorBoundary'>
        <div className='error-content'>
          <div className='error-header'>
            <Icon icon='warning' size='xl' />
            <h1>Oops! Something went wrong</h1>
          </div>

          <div className='error-message'>
            <div className='error-text' style={{ textAlign: "center", fontSize: "16px", color: "#a0a0a0" }}>
              We're sorry, but something unexpected happened. Our team has been notified and we're working on fixing it.
            </div>
          </div>

          <div className='error-actions'>
            <Button variant='filled' onClick={reset}>
              <Icon icon='retry' />
              Try Again
            </Button>
            <Button variant='outlined' onClick={() => (window.location.href = "/")}>
              <Icon icon='home' />
              Go Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='error-boundary' data-component='ErrorBoundary'>
      <div className='error-content'>
        <div className='error-header'>
          <Icon icon='warning' size='xl' />
          <h1>Development Error</h1>
        </div>

        <div className='error-message'>
          <div className='error-name'>{error.name}</div>
          <div className='error-text'>{error.message}</div>
        </div>

        {error.stack && (
          <details className='error-details'>
            <summary>Stack Trace</summary>
            <pre className='error-stack'>{error.stack}</pre>
          </details>
        )}

        {stackLines.length > 0 && (
          <details className='error-details'>
            <summary>Component Stack</summary>
            <div className='component-stack'>
              {stackLines.map((line, index) => (
                <div key={index} className='stack-frame'>
                  {line.trim()}
                </div>
              ))}
            </div>
          </details>
        )}

        <div className='error-actions'>
          <Button variant='filled' onClick={reset}>
            <Icon icon='retry' />
            Try Again
          </Button>
          <Button variant='outlined' onClick={() => window.location.reload()}>
            <Icon icon='retry' />
            Reload Page
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  return <ErrorBoundaryClass fallback={fallback || ((error, errorInfo, reset) => <DefaultErrorFallback error={error} errorInfo={errorInfo} reset={reset} />)}>{children}</ErrorBoundaryClass>;
}
