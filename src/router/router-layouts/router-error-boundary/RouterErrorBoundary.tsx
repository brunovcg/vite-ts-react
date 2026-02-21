import { useRouteError } from "react-router-dom";
import { Button } from "@/components/button/Button.component";
import { Icon } from "@/components/icon/Icon.component";
import "@/components/error-boundary/ErrorBoundary.component.css";
import { routerErrorBoundaryLocales } from "./RouterErrorBounday.locales";
import { useDictionary } from "@/locales";

export function RouterErrorBoundary() {
  const error = useRouteError() as Error;
  const isDev = import.meta.env.DEV;

  const errorMessage = error?.message || "An unexpected error occurred";
  const errorName = error?.name || "Error";
  const errorStack = error?.stack;
  const dictionary = useDictionary(routerErrorBoundaryLocales);

  if (!isDev) {
    return (
      <div className='error-boundary' data-component='RouterErrorBoundary'>
        <div className='error-content'>
          <div className='error-header'>
            <Icon icon='warning' size='xl' />
            <h1>Oops! Page Not Found</h1>
          </div>

          <div className='error-message'>
            <div className='error-text' css={["text-center", "font-size-lg", "color-primary"]}>
              {dictionary.error}
            </div>
          </div>

          <div className='error-actions'>
            <Button variant='filled' onClick={() => (window.location.href = "/")}>
              <Icon icon='home' />
              {dictionary.goHome}
            </Button>
            <Button variant='outlined' onClick={() => window.history.back()}>
              <Icon icon='arrowBack' />
              {dictionary.goBack}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='error-boundary' data-component='RouterErrorBoundary'>
      <div className='error-content'>
        <div className='error-header'>
          <Icon icon='warning' size='xl' />
          <h1>Development Router Error</h1>
        </div>

        <div className='error-message'>
          <div className='error-name'>{errorName}</div>
          <div className='error-text'>{errorMessage}</div>
        </div>

        {errorStack && (
          <details className='error-details'>
            <summary>Stack Trace</summary>
            <pre className='error-stack'>{errorStack}</pre>
          </details>
        )}

        <div className='error-actions'>
          <Button variant='filled' onClick={() => window.history.back()}>
            <Icon icon='arrowBack' />
            Go Back
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
