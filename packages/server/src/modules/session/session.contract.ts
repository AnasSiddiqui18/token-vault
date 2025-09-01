import z from "zod";
import { oc } from "@orpc/contract";

export const getCurrentSession = oc
    .route({
        path: "/user/get-current-user",
        method: "GET",
    })
    .output(
        z.object({
            id: z.string(),
            userId: z.string(),
            token: z.string(),
        }),
    );

export const sessionContract = oc.router({ getSession: getCurrentSession });
