import { defineConfig } from "drizzle-kit";
import { Config } from "./src/core/config.ts";

export default defineConfig({
  out: "./src/db/migrations",
  schema: "./src/db/schema/*.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: Config.DATABASE_URL,
  },
});
