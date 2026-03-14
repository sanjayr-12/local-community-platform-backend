CREATE TABLE "comments" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (
    sequence name "comments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START
    WITH
      1 CACHE 1
  ),
  "post_id" integer,
  "author_id" integer,
  "content" text NOT NULL
);

--> statement-breakpoint
CREATE TABLE "posts" (
  "id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (
    sequence name "posts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START
    WITH
      1 CACHE 1
  ),
  "author_id" integer,
  "content" text NOT NULL,
  "image_url" text,
  "location" geometry (point),
  "district_tag" text,
  "state_tag" text,
  "created_At" timestamp DEFAULT now(),
  "updated_at" timestamp DEFAULT now() NOT NULL
);

--> statement-breakpoint
ALTER TABLE "comments"
ADD CONSTRAINT "comments_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts" ("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint
ALTER TABLE "comments"
ADD CONSTRAINT "comments_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users" ("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint
ALTER TABLE "posts"
ADD CONSTRAINT "posts_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users" ("id") ON DELETE no action ON UPDATE no action;

--> statement-breakpoint
CREATE INDEX "spatial_index" ON "posts" USING gist ("location");
