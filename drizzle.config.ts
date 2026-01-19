import { defineConfig } from "drizzle-kit";
import { Config } from "./src/config";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  casing: "snake_case",
  dbCredentials: {
    url: Config.POSTGRES_URL,
  },
});
