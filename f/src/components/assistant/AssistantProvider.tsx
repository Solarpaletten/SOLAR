import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AssistantProvider } from "@/components/assistant/AssistantContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AssistantProvider>
      <App />
    </AssistantProvider>
  </React.StrictMode>
);
