import {
  boolean,
  integer,
  pgEnum,
  real,
  text,
  timestamp,
} from "drizzle-orm/pg-core"

export const lifecycleDates = {
  createdAt: timestamp("created_at", { mode: "date" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", {
    mode: "date",
  }).$onUpdate(() => new Date()),
}

export const pgWeightUnits = pgEnum("weightUnit", ["kg", "g", "lb", "oz"])
export const pgSizeUnits = pgEnum("pgSizeUnit", ["m", "cm", "mm", "in", "ft"])

export const productFields = {
  price: real("price").notNull().default(0),
  inventoryQuantity: integer("inventory_quantity").notNull().default(0),
  allowBackorder: boolean("allow_backorder").notNull().default(false),
  manageInventory: boolean("manage_inventory").notNull().default(false),
  weight: real("weight").notNull(),
  length: real("length"),
  height: real("height"),
  width: real("width"),
  weightUnit: pgWeightUnits("weightUnit").notNull().default("kg"),
  heightUnit: pgSizeUnits("heightUnit").notNull().default("m"),
  lengthUnit: pgSizeUnits("lengthUnit").notNull().default("m"),
  widthUnit: pgSizeUnits("widthUnit").notNull().default("m"),
  originCountry: text("origin_country"),
  material: text("material"),
}
