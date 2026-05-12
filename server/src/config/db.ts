import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

dotenv.config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("No database connection string was provided to `neon()`. Perhaps an environment variable has not been set?");
}

const sql = neon(connectionString);

export const db = drizzle(sql);
