import { oc } from "@orpc/contract";
import z from "zod";

export const userCreateInput = z.object({
    name: z.string(),
    email: z.string(),
    password: z.string(),
});

export const createUser = oc
    .route({
        method: "POST",
        path: "/users/sign-up",
    })
    .input(userCreateInput);

export const loginUser = oc
    .route({
        method: "POST",
        path: "/users/sign-in",
    })
    .input(
        userCreateInput.pick({
            email: true,
            password: true,
        }),
    )
    .output(
        z.object({
            token: z.string(),
        }),
    );

export const userContract = oc.router({
    create: createUser,
    login: loginUser,
});
