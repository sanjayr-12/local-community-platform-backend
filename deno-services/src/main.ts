import "reflect-metadata";
import { Context, Hono } from "hono";
import { Config } from "./core/config.ts";
import { checkDBConnection } from "./core/db.ts";
import { allRoutes } from "./routes.ts";
import { cors } from "hono/cors";
import process from "node:process";

const app = new Hono();

app.use("*", cors());

app.get("/", (c: Context) => {
  return c.text("Hello Hono!");
});

allRoutes.forEach((route) => {
  app.route(`/api/${route.path}`, route.handler);
});

try {
  await checkDBConnection();
} catch (_error) {
  process.exit(1);
}

Deno.serve({ port: Config.PORT }, app.fetch);
