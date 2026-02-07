import { integer, pgTable, varchar } from "drizzle-orm/pg-core";
export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull(),
  username: varchar().notNull().unique(),
  email: varchar().notNull().unique(),
});
