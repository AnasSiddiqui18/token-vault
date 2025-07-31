import { implement } from "@orpc/server";
import { userRouter } from "@/modules/users/users.controller";
import { contract } from "@/contracts";
import { serviceRouter } from "@/modules/services/service.controller";
import { auth } from "./auth/auth";

export const router = implement(contract)
    .$context<{
        user: typeof auth.$Infer.Session.user;
        session: typeof auth.$Infer.Session.session;
    }>()
    .router({
        user: userRouter,
        service: serviceRouter,
    });
