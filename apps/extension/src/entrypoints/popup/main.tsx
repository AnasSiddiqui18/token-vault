import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { MemoryRouter } from "react-router";
import { TanstackWrapper } from "@/tanstack/Tanstack-wrapper.tsx";
import { HeroUIProvider } from "@heroui/react";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <TanstackWrapper>
            <MemoryRouter initialEntries={["/sign-in", "/dashboard"]}>
                <HeroUIProvider>
                    <App />
                </HeroUIProvider>
            </MemoryRouter>
        </TanstackWrapper>
    </React.StrictMode>,
);
