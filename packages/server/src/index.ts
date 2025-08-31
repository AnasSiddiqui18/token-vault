import { router } from "./router";
import { OpenAPIHandler } from "@orpc/openapi/fetch";
import { Hono } from "hono";
import { ORPCError } from "@orpc/client";
import { _auth } from "./auth/auth";
import type { Env } from "./types/index";
import { cors } from "hono/cors";

const app = new Hono<{
    Bindings: Env;
}>();

const handler = new OpenAPIHandler(router);

app.use(
    "*",
    cors({
        origin: "chrome-extension://hifbciaadeigecbnkndkhcfhkpfjiaco",
        allowHeaders: ["Content-Type", "Authorization"],
        allowMethods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"],
        credentials: true,
    }),
);

app.on(["POST", "GET"], "/api/auth/*", async (c) => {
    console.log("auth runs");

    const { auth } = _auth(c.env);
    const auth_res = await auth.handler(c.req.raw);
    return auth_res;
});

app.get("/", (c) => {
    return c.json({ status: "Server is working" });
});

app.use("/api/*", async (c) => {
    console.log("handler runs");

    const { response } = await handler.handle(c.req.raw, {
        prefix: "/api",
        context: {
            req: c.req.raw,
            env: c.env,
        },
    });

    if (!response) {
        return Response.json(
            new ORPCError("NOT_FOUND", {
                message: "Endpoint not found",
            }),
            { status: 404 },
        );
    }

    return response;
});

export default app;
