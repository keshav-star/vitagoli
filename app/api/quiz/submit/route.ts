import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateFeedback } from '@/lib/gemini';
import connectDB from '@/lib/mongo';
import QuizResult from '@/models/QuizResult';
import { IQuestion } from '@/models/QuizResult';

const QuizSubmissionSchema = z.object({
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

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = QuizSubmissionSchema.parse(body);
    const { topic, questions, answers } = validatedData;

    // Calculate score
    const score = questions.reduce((acc, q, i) => 
      acc + (answers[i] === q.correctAnswer ? 1 : 0), 0);

    // Generate feedback using Gemini
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

    // Return response
    return NextResponse.json({
      success: true,
      resultId: result._id,
    });
  } catch (error) {
    console.error('Quiz submission error:', error);
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid submission data',
        details: error.issues,
      }, { status: 400 });
    }

    // Handle other errors
    return NextResponse.json({
      success: false,
      error: 'Failed to process quiz submission',
    }, { status: 500 });
  }
}