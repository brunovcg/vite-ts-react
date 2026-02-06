import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Router } from "@/router/Router";
import { LocaleProvider } from "@/locales";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import "@/styles/reducer.css";
import "@/proto/proto";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary>
      <LocaleProvider>
        <Router />
      </LocaleProvider>
    </ErrorBoundary>
  </StrictMode>,
);
