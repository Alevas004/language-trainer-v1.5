import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./routes/App.tsx";
import { ProgressProvider } from "./context/ProgressContext.tsx";
import { SettingsProvider } from "./context/SettingsContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <SettingsProvider>
      <ProgressProvider>
        <App />
      </ProgressProvider>
    </SettingsProvider>
  </StrictMode>
);
