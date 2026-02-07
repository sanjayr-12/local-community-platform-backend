// deno-lint-ignore-file no-explicit-any
import { Config } from "./config.ts";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

let dbInstance: any = null;

export const getPostgresClient = () => {
  if (dbInstance) return dbInstance;
  const url = Config.DATABASE_URL;

  try {
    if (!url || url.toString().trim() === "") {
      throw new Error("Database URL not configired");
    }

    const client = postgres(Config.DATABASE_URL);
    dbInstance = drizzle({ client });

    console.log("DB Connected");

    return dbInstance;
  } catch (error: any) {
    console.log("DB connection error " + error.message);
  }
};
