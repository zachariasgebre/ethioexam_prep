import { config as loadDotEnv } from "dotenv";
import { defineConfig } from "drizzle-kit";

loadDotEnv({ path: ".env.local" });

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
});
