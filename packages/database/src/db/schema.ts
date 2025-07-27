import { relations } from "drizzle-orm";
import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

const newDate = () => new Date();

export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).unique().notNull(),
  password: varchar({ length: 255 }),
  created_at: timestamp().defaultNow().$onUpdate(newDate).notNull(),
  updated_at: timestamp().defaultNow().$onUpdate(newDate).notNull(),
});

export const session = pgTable("session", {
  id: uuid().primaryKey().defaultRandom(),
  user_id: uuid("user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  created_at: timestamp().defaultNow().$onUpdate(newDate).notNull(),
  updated_at: timestamp().defaultNow().$onUpdate(newDate).notNull(),
});

export const userRelations = relations(users, ({ many }) => ({
  sessions: many(session),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(users, { fields: [session.user_id], references: [users.id] }),
}));
