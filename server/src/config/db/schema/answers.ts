import {
  pgTable,
  uuid,
  unique
} from "drizzle-orm/pg-core";

import { responses } from "./responses.js";
import { questions } from "./questions.js";
import { options } from "./options.js";

export const answers = pgTable(
  "answers",
  {
    id: uuid("id")
      .defaultRandom()
      .primaryKey(),

    responseId: uuid("response_id")
      .references(() => responses.id, {
        onDelete: "cascade"
      })
      .notNull(),

    questionId: uuid("question_id")
      .references(() => questions.id, {
        onDelete: "cascade"
      })
      .notNull(),

    optionId: uuid("option_id")
      .references(() => options.id, {
        onDelete: "cascade"
      })
      .notNull()
  },

  (table) => [
    unique("unique_question_per_response")
      .on(table.responseId, table.questionId)
  ]
);