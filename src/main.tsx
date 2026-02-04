import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Router } from "@/router/Router";
import { LocaleProvider } from "@/locales";
import { DialogProvider } from "@/dialogs/Dialog.provider";
import "@/styles/reducer.css";
import "@/proto/proto";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <LocaleProvider>
      <Router />
      <DialogProvider />
    </LocaleProvider>
  </StrictMode>,
);
