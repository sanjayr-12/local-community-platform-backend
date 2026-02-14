import { Config } from "./config.ts";
import { drizzle } from "drizzle-orm/postgres-js";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../db/schema/index.ts";

let dbInstance: PostgresJsDatabase<typeof schema> | null = null;
export type DB = typeof dbInstance;

export const getPostgresClient = (): PostgresJsDatabase<typeof schema> => {
  if (dbInstance) return dbInstance;

  const url = Config.DATABASE_URL;

  if (!url || url.toString().trim() === "") {
    throw new Error("Database URL not configured");
  }

  try {
    const client = postgres(url);

    dbInstance = drizzle(client, { schema });

    console.log("DB Connected");

    return dbInstance;
  } catch (error: any) {
    console.log("DB connection error " + error.message);
    throw error;
  }
};
