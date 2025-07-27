import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { MemoryRouter } from "react-router";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MemoryRouter initialEntries={["/sign-up", "/sign-in"]}>
      <App />
    </MemoryRouter>
  </React.StrictMode>
);
