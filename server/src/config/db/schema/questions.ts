import {
  pgTable,
  uuid,
  text,
  boolean,
  integer
} from "drizzle-orm/pg-core";

import { polls } from "./polls.js";

export const questions = pgTable("questions", {
  id: uuid("id").defaultRandom().primaryKey(),

  pollId: uuid("poll_id")
    .references(() => polls.id, {
      onDelete: "cascade"
    })
    .notNull(),

  questionText: text("question_text")
    .notNull(),

  isRequired: boolean("is_required")
    .default(false),

  orderIndex: integer("order_index")
    .notNull()
});