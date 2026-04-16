import "reflect-metadata";
import { Context, Hono } from "hono";
import { Config } from "./core/config.ts";
import { checkDBConnection } from "./core/db.ts";
import { allRoutes } from "./routes.ts";
import { cors } from "hono/cors";
import process from "node:process";

const KEEP_ALIVE_INTERVAL_MS = 10 * 60 * 1000;

function startKeepAlive(backendUrl: string) {
  console.log(`[keep-alive] Pinger started → hitting ${backendUrl}/ping every 10 min`);
  setInterval(async () => {
    try {
      const res = await fetch(`${backendUrl}/ping`);
      if (res.ok) {
        console.log(`[keep-alive] Ping successful at ${new Date().toISOString()}`);
      } else {
        console.warn(`[keep-alive] Ping returned status ${res.status}`);
      }
    } catch (err) {
      console.error(`[keep-alive] Ping failed: ${err.message}`);
    }
  }, KEEP_ALIVE_INTERVAL_MS);
}

const app = new Hono();

app.use("*", cors());

app.get("/", (c: Context) => {
  return c.text("Hello Hono!");
});

app.get("/ping", (c: Context) => {
  console.log(`[ping] Keep-alive request received at ${new Date().toISOString()}`);
  return c.json({ status: "ok", message: "pong", timestamp: new Date().toISOString() });
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

if (Config.BACKEND_URL) {
  startKeepAlive(Config.BACKEND_URL);
} else {
  console.log("[keep-alive] BACKEND_URL not set — pinger disabled (running locally).");
}
