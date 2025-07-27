import { implement } from "@orpc/server";
import { userContract } from "./users.contract";
import { db } from "@repo/database/index";
import { users } from "@repo/database/db/schema";

const os = implement(userContract);

export const userRouter = implement(userContract).router({
  create: os.create.handler(async ({ input }) => {
    try {
      const { email, name, password } = input;

      const user = await db
        .insert(users)
        .values({
          email,
          name,
          password,
        })
        .returning();

      console.log("user created successfully", user);
      return { message: "User created 🎉" };
    } catch (error) {
      console.error("error while creating user", error);
    }
  }),
});
