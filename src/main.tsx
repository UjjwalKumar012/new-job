
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

async function prepareApp() {
  if (import.meta.env.DEV) {
    const { worker } = await import("./mocks/browser");

    await worker.start();
  }

  const { default: App } = await import("./App");

  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

prepareApp().catch((error: unknown) => {
  console.error("Failed to start New Job:", error);
});
