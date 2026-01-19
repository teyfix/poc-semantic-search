import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { Config } from "../config";

export const pool = new Pool({
  connectionString: Config.POSTGRES_URL,
});

export const db = drizzle({
  client: pool,
  casing: "snake_case",
});
