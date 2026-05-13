import { Response } from "express";

import { eq, desc, and } from "drizzle-orm";

import { db } from "../config/db.js";

import { polls } from "../config/db/schema/polls.js";
import { questions } from "../config/db/schema/questions.js";
import { options } from "../config/db/schema/options.js";

import { AuthRequest } from "../middleware/auth.middlewere.js";

import { createPollService } from "../services/poll.service.js";



export const createPoll = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    const {
      title,
      description,
      allowAnonymous,
      requireAuth,
      expiresAt,
      questions
    } = req.body;



    if (!title || !questions?.length) {
      return res.status(400).json({
        message: "Title and questions required"
      });
    }



    for (const question of questions) {

      if (!question.questionText) {
        return res.status(400).json({
          message: "Question text required"
        });
      }



      if (
        !question.options ||
        question.options.length < 2
      ) {
        return res.status(400).json({
          message: "Each question needs at least 2 options"
        });
      }
    }



    const poll = await createPollService({
      title,
      description,
      allowAnonymous,
      requireAuth,
      expiresAt,
      questions,
      creatorId: req.user!.id
    });



    return res.status(201).json({
      message: "Poll created successfully",
      poll
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Server Error"
    });
  }
};



export const getMyPolls = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    const userPolls = await db
      .select()
      .from(polls)
      .where(eq(polls.creatorId, req.user!.id))
      .orderBy(desc(polls.createdAt));



    return res.status(200).json({
      polls: userPolls
    });

  } catch (error) {

    return res.status(500).json({
      message: "Server Error"
    });
  }
};



export const getSinglePoll = async (
  req: AuthRequest,
  res: Response
) => {
  try {

    const pollId = req.params.id as string;



    const foundPolls = await db
      .select()
      .from(polls)
      .where(eq(polls.id, pollId));



    if (foundPolls.length === 0) {
      return res.status(404).json({
        message: "Poll not found"
      });
    }



    const poll = foundPolls[0];



    const pollQuestions = await db
      .select()
      .from(questions)
      .where(eq(questions.pollId, poll.id));



    const formattedQuestions = [];



    for (const question of pollQuestions) {

      const questionOptions = await db
        .select()
        .from(options)
        .where(eq(options.questionId, question.id));



      formattedQuestions.push({
        ...question,
        options: questionOptions
      });
    }



    return res.status(200).json({
      poll: {
        ...poll,
        questions: formattedQuestions
      }
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Server Error"
    });
  }
};

export const updatePoll = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const pollId = req.params.id as string;

    const {
      title,
      description,
      allowAnonymous,
      requireAuth,
      expiresAt,
      questions: updatedQuestions
    } = req.body;



    // 1. Verify Poll Ownership

    const foundPolls = await db
      .select()
      .from(polls)
      .where(
        and(
          eq(polls.id, pollId),
          eq(polls.creatorId, req.user!.id)
        )
      );



    if (foundPolls.length === 0) {
      return res.status(404).json({
        message: "Poll not found"
      });
    }



    // 2. Update Poll Metadata

    await db
      .update(polls)
      .set({
        title,
        description,
        allowAnonymous,
        requireAuth,
        expiresAt: expiresAt
          ? new Date(expiresAt)
          : null,
        updatedAt: new Date()
      })
      .where(eq(polls.id, pollId));



    // 3. Delete Old Questions
    // options auto-delete via cascade

    await db
      .delete(questions)
      .where(eq(questions.pollId, pollId));



    // 4. Recreate Questions + Options

    for (let i = 0; i < updatedQuestions.length; i++) {

      const question = updatedQuestions[i];

      const createdQuestion = await db
        .insert(questions)
        .values({
          pollId,
          questionText: question.questionText,
          isRequired: question.isRequired,
          orderIndex: i
        })
        .returning();



      const questionId =
        createdQuestion[0].id;



      const optionValues =
        question.options.map(
          (option: string) => ({
            questionId,
            optionText: option
          })
        );



      await db
        .insert(options)
        .values(optionValues);
    }



    return res.status(200).json({
      message: "Poll updated successfully"
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Server Error"
    });
  }
};

export const deletePoll = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const pollId = req.params.id as string;



    const foundPolls = await db
      .select()
      .from(polls)
      .where(
        and(
          eq(polls.id, pollId),
          eq(polls.creatorId, req.user!.id)
        )
      );



    if (foundPolls.length === 0) {
      return res.status(404).json({
        message: "Poll not found"
      });
    }



    await db
      .delete(polls)
      .where(eq(polls.id, pollId));



    return res.status(200).json({
      message: "Poll deleted successfully"
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      message: "Server Error"
    });
  }
};