import { Context, Hono } from "hono";
import { Config } from "./core/config.ts";
import { getPostgresClient } from "./core/db.ts";

const app = new Hono();

app.get("/", (c: Context) => {
  return c.text("Hello Hono!");
});

await getPostgresClient();

Deno.serve({ port: Config.PORT }, app.fetch);
