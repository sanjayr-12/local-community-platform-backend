import {
  geometry,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
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

export const posts = pgTable("posts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  authorId: integer("author_id").references(() => users.id),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  location: geometry("location", { type: "point", mode: "xy", srid: 4326 }),
  districtTag: text("district_tag"),
  stateTag: text("state_tag"),
  created_at: timestamp("created_At").defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "date" })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
}, (table) => ({
  spatialIndex: index("spatial_index").using("gist", table.location),
}));

export const comments = pgTable("comments", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  post_id: integer("post_id").references(() => posts.id),
  author_id: integer("author_id").references(() => users.id),
  content: text("content").notNull(),
});
