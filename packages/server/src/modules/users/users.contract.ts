import { oc } from "@orpc/contract";
import * as z from "zod";

export const userCreateInput = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

export const createUser = oc
  .route({
    method: "POST",
    path: "/users/lol",
  })
  .input(userCreateInput);

export const userContract = oc.router({
  create: createUser,
});
