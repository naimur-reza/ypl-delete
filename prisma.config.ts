import { defineConfig, env } from "prisma/config";
import "dotenv/config";

export default defineConfig({
  schema: "prisma/schema",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Use DIRECT_URL for migrations/db push, fallback to DATABASE_URL
    url: env("DIRECT_URL") ?? env("DATABASE_URL"),
    // shadowDatabaseUrl: env("SHADOW_DATABASE_URL"),
  },
});
