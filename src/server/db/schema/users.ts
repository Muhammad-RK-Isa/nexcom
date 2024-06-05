import { relations } from "drizzle-orm";
import {
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";
import { z } from "zod";

import { accounts } from "./accounts";
import { generateId } from "~/lib/utils";

export const pgUserRolesEnum = pgEnum("userRole", [
  "viewer",
  "customer",
  "admin",
]);

export const UserRole = z.enum(pgUserRolesEnum.enumValues);

export const users = pgTable(
  "user",
  {
    id: varchar("id", { length: 255 })
      .notNull()
      .primaryKey()
      .$defaultFn(() => generateId({ prefix: "user" })),
    name: varchar("name", { length: 255 }),
    email: varchar("email", { length: 255 }).notNull(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: varchar("image", { length: 255 }),
    role: pgUserRolesEnum("role").default("customer").notNull(),
    hashedPassword: varchar("hashed_password"),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
    updatedAt: timestamp("updated_at", {
      mode: "date",
      precision: 3,
    }).$onUpdate(() => new Date()),
  },
  (t) => ({
    emailIdx: uniqueIndex("user_email_idx").on(t.email),
  }),
);

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));
