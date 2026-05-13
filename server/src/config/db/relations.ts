import { relations } from "drizzle-orm";

import { polls } from "./schema/polls.js";
import { questions } from "./schema/questions.js";
import { options } from "./schema/options.js";
import { responses } from "./schema/responses.js";
import { answers } from "./schema/answers.js";
import { users } from "./schema/users.js";

export const pollRelations = relations(polls, ({ one, many }) => ({
  creator: one(users, {
    fields: [polls.creatorId],
    references: [users.id]
  }),

  questions: many(questions),

  responses: many(responses)
}));

export const questionRelations = relations(questions, ({ one, many }) => ({
  poll: one(polls, {
    fields: [questions.pollId],
    references: [polls.id]
  }),

  options: many(options),

  answers: many(answers)
}));

export const optionRelations = relations(options, ({ one }) => ({
  question: one(questions, {
    fields: [options.questionId],
    references: [questions.id]
  })
}));

export const responseRelations = relations(responses, ({ one, many }) => ({
  poll: one(polls, {
    fields: [responses.pollId],
    references: [polls.id]
  }),

  user: one(users, {
    fields: [responses.userId],
    references: [users.id]
  }),

  answers: many(answers)
}));

export const answerRelations = relations(answers, ({ one }) => ({
  response: one(responses, {
    fields: [answers.responseId],
    references: [responses.id]
  }),

  question: one(questions, {
    fields: [answers.questionId],
    references: [questions.id]
  }),

  option: one(options, {
    fields: [answers.optionId],
    references: [options.id]
  })
}));