import { db } from "../config/db.js";
import { polls } from "../config/db/schema/polls.js";
import { questions } from "../config/db/schema/questions.js";
import { options } from "../config/db/schema/options.js";

interface CreatePollData {
  title: string;
  description?: string;
  allowAnonymous: boolean;
  requireAuth: boolean;
  expiresAt?: string;
  creatorId: string;

  questions: {
    questionText: string;
    isRequired: boolean;
    options: string[];
  }[];
}

export const createPollService = async (
  data: CreatePollData
) => {

  return await db.transaction(async (tx) => {

    // 1. Create Poll

    const createdPoll = await tx
      .insert(polls)
      .values({
        title: data.title,
        description: data.description,
        allowAnonymous: data.allowAnonymous,
        requireAuth: data.requireAuth,
        expiresAt: data.expiresAt
          ? new Date(data.expiresAt)
          : null,
        creatorId: data.creatorId
      })
      .returning();



    const poll = createdPoll[0];



    // 2. Create Questions + Options

    for (let i = 0; i < data.questions.length; i++) {

      const question = data.questions[i];

      const createdQuestion = await tx
        .insert(questions)
        .values({
          pollId: poll.id,
          questionText: question.questionText,
          isRequired: question.isRequired,
          orderIndex: i
        })
        .returning();



      const questionId = createdQuestion[0].id;



      const optionValues = question.options.map(
        (option) => ({
          optionText: option,
          questionId
        })
      );



      await tx.insert(options).values(optionValues);
    }



    return poll;
  });
};