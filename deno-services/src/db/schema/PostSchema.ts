import {
  geometry,
  index,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { users } from "./UserSchema.ts";

export const posts = pgTable(
  "posts",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    authorId: integer("author_id").references(() => users.id),
    content: text("content").notNull(),
    imageUrl: text("image_url"),
    publicId: text("public_id"),
    location: geometry("location", { type: "point", mode: "xy", srid: 4326 }),
    districtTag: text("district_tag"),
    stateTag: text("state_tag"),
    stateDistrictTag: text("state_district_tag"),
    created_at: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (table) => ({
    spatialIndex: index("spatial_index").using("gist", table.location),
  }),
);

export const comments = pgTable("comments", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  postId: integer("post_id").references(() => posts.id),
  authorId: integer("author_id").references(() => users.id),
  content: text("content").notNull(),
});

export const saved = pgTable("saved_posts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  authorId: integer("author_id").references(()=> users.id).notNull(),
  postId: integer("post_id").references(()=>posts.id).notNull(),
  createdAt: timestamp("created_at").defaultNow()
});