import { pgTable, uuid, boolean, timestamp, unique } from "drizzle-orm/pg-core";

import { polls } from "./polls.js";
import { users } from "./users.js";

export const responses = pgTable(
  "responses",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    pollId: uuid("poll_id")
      .references(() => polls.id, {
        onDelete: "cascade",
      })
      .notNull(),

    userId: uuid("user_id").references(() => users.id, {
      onDelete: "set null",
    }),

    isAnonymous: boolean("is_anonymous").default(false),

    submittedAt: timestamp("submitted_at").defaultNow(),
  },
  (table) => [
    unique("unique_user_poll").on(table.pollId, table.userId),
  ]
);