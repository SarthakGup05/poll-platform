import type { Config } from "drizzle-kit";

const config = {
  schema: "./src/config/db/schema/*",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!
  }
} satisfies Config;

export default config;