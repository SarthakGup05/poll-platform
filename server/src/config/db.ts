import dotenv from "dotenv";
import { drizzle } from "drizzle-orm/neon-serverless";
import { Pool, neonConfig } from "@neondatabase/serverless";
import ws from "ws";

dotenv.config();

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("No database connection string was provided. Perhaps an environment variable has not been set?");
}

const pool = new Pool({
  connectionString,
});

export const db = drizzle(pool);

console.log("USING NEON SERVERLESS DRIVER");
