import type { Logger } from "pino";
import type { auth } from "./auth/auth";

export type InitialContext = {
    req: Request;
    console: Logger;
};

export type ContextWithUser = {
    user: typeof auth.$Infer.Session.user;
} & InitialContext;
