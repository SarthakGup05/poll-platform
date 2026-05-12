import {
  pgTable,
  uuid,
  text
} from "drizzle-orm/pg-core";

import { questions } from "./questions";

export const options = pgTable("options", {
  id: uuid("id").defaultRandom().primaryKey(),

  optionText: text("option_text")
    .notNull(),

  questionId: uuid("question_id")
    .references(() => questions.id, {
      onDelete: "cascade"
    })
    .notNull()
});