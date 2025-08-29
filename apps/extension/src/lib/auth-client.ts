import { createAuthClient } from "better-auth/react";

console.log("server", import.meta.env.WXT_API_KEY);

export const authClient = createAuthClient({
    baseURL: "http://127.0.0.1:8787",
    fetchOptions: {
        credentials: "include",
    },
});

