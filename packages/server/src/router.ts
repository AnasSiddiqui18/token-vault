import { implement } from "@orpc/server";
import { userContract } from "./modules/users/users.contract";
import { userRouter } from "./modules/users/users.controller";

const contract = {
  users: userContract,
};

export const router = implement(contract).router({
  users: userRouter,
});
