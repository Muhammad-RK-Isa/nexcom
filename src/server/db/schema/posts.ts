import {
  index,
  pgTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

import { users } from "./users";

export const posts = pgTable(
  "posts",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    createdById: varchar("createdById", { length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").$onUpdate(() => new Date()),
  },
  (example) => ({
    createdByIdIdx: index("createdById_idx").on(example.createdById),
    nameIndex: index("name_idx").on(example.name),
  }),
);
