import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp
} from "drizzle-orm/pg-core";

import { users } from "./users.js";

export const polls = pgTable("polls", {
  id: uuid("id").defaultRandom().primaryKey(),

  title: varchar("title", { length: 255 }).notNull(),

  description: text("description"),

  allowAnonymous: boolean("allow_anonymous")
    .default(true),

  requireAuth: boolean("require_auth")
    .default(false),

  isPublished: boolean("is_published")
    .default(false),

  expiresAt: timestamp("expires_at"),

  creatorId: uuid("creator_id")
    .references(() => users.id, {
      onDelete: "cascade"
    })
    .notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at")
    .defaultNow()
    .notNull()
});