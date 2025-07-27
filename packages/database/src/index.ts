import * as schema from "./db/schema";
import { drizzle } from "drizzle-orm/node-postgres";
import "dotenv/config";

export const db = drizzle(process.env.POSTGRES_URL!, {
  schema,
});
