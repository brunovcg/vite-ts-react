import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Router } from "@/router/Router";
import { LocaleProvider } from "@/locales";
import "@/styles/reducer.css";
import "@/proto/proto";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LocaleProvider>
      <Router />
    </LocaleProvider>
  </StrictMode>,
);
