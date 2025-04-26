import { createTRPCRouter, publicProcedure } from '../trpc';
import { z } from "zod";
import { db } from '@/server/db';

export const quizRouter = createTRPCRouter({
  createQuiz: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        subject: z.string().min(1),
        code: z.string().min(1),
        creatorId: z.string().min(1),
        startTime: z.string().datetime(),
        endTime: z.string().datetime(),
        questions: z.array(
          z.object({
            text: z.string().min(1),
            options: z.array(z.string().min(1)).min(2),
            answer: z.string().min(1),
          })
        ).min(1),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Check if quiz code already exists
        const existingQuiz = await ctx.db.quiz.findUnique({
          where: { code: input.code },
        });

        if (existingQuiz) {
          throw new Error("Quiz code already exists");
        }

        const quiz = await ctx.db.quiz.create({
          data: {
            title: input.title,
            subject: input.subject,
            code: input.code,
            creatorId: input.creatorId,
            startTime: new Date(input.startTime),
            endTime: new Date(input.endTime),
            questions: {
              create: input.questions.map(question => ({
                text: question.text,
                options: question.options,
                answer: question.answer,
              })),
            },
          },
          include: {
            questions: true,
          },
        });
        return quiz;
      } catch (error: any) {
        console.error("Error creating quiz:", error);
        throw new Error(error.message || "Failed to create quiz");
      }
    })
});