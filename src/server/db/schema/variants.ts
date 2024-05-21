import { pgTable, varchar } from "drizzle-orm/pg-core";
import { generateId } from "~/lib/utils";

export const variants = pgTable("variants", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => generateId({ prefix: "variants" })),
});
