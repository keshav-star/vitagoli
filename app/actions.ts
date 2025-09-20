'use server';

import { z } from 'zod';
import { generateQuestions, generateFeedback } from '@/lib/gemini';
import connectDB from '@/lib/mongo';
import QuizResult from '@/models/QuizResult';
import { IQuestion } from '@/models/QuizResult';

const GenerateQuizSchema = z.object({
  topic: z.string().min(1),
});

const SubmitQuizSchema = z.object({
  sessionId: z.string(),
  topic: z.string(),
  questions: z.array(z.object({
    id: z.number(),
    question: z.string(),
    options: z.array(z.string()),
    correctAnswer: z.string(),
  })),
  answers: z.array(z.string()),
});

interface Session {
  id: string;
  topic: string;
  questions: IQuestion[];
  currentQuestion: number;
  createdAt: Date;
}

// In-memory session storage (replace with Redis in production)
const sessions: Record<string, Session> = {};

export async function generateQuiz(data: { topic: string }) {
  try {
    const { topic } = GenerateQuizSchema.parse(data);
    const questions = await generateQuestions(topic);
    const sessionId = Math.random().toString(36).substring(2, 15);

    // Store session
    sessions[sessionId] = {
      id: sessionId,
      topic,
      questions,
      currentQuestion: 0,
      createdAt: new Date(),
    };

    return { success: true, sessionId };
  } catch (error) {
    console.error('Error generating quiz:', error);
    return { success: false, error: 'Failed to generate quiz' };
  }
}

export async function getSession(sessionId: string) {
  try {
    const session = sessions[sessionId];
    if (!session) {
      return { success: false, error: 'Session not found' };
    }
    return { success: true, ...session };
  } catch (error) {
    console.error('Error fetching session:', error);
    return { success: false, error: 'Failed to fetch session' };
  }
}

export async function submitQuiz(data: {
  sessionId: string;
  topic: string;
  questions: IQuestion[];
  answers: string[];
}) {
  try {
    const validated = SubmitQuizSchema.parse(data);
    const { topic, questions, answers } = validated;

    // Calculate score
    const score = questions.reduce(
      (acc, q, i) => acc + (answers[i] === q.correctAnswer ? 1 : 0),
      0
    );

    // Generate feedback
    const feedback = await generateFeedback(topic, questions, answers);

    // Save to MongoDB
    await connectDB();
    const result = await QuizResult.create({
      topic,
      questions,
      answers,
      score,
      feedback,
    });

    return { success: true, sessionId: result._id };
  } catch (error) {
    console.error('Error submitting quiz:', error);
    if (error instanceof z.ZodError) {
      return { success: false, error: 'Invalid submission data' };
    }
    return { success: false, error: 'Failed to submit quiz' };
  }
}