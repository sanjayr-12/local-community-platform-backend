import { integer, pgTable, timestamp, varchar } from "drizzle-orm/pg-core";
export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull(),
  username: varchar().notNull().unique(),
  email: varchar().notNull().unique(),
  picture: varchar(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});
