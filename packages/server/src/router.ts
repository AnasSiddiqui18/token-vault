import { implement } from "@orpc/server";
import { contract } from "@/contracts";
import { serviceRouter } from "@/modules/services/service.controller";
import { auth } from "./auth/auth";

export const router = implement(contract)
    .$context<{
        user: typeof auth.$Infer.Session.user;
        session: typeof auth.$Infer.Session.session;
    }>()
    .router({
        service: serviceRouter,
    });
