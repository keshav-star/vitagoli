import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongo';
import QuizResult from '@/models/QuizResult';
import { computeQuizResult } from '@/lib/recommendation';
import { sendQuizResultEmail } from '@/lib/email';
import { z } from 'zod';

// Define types for the quiz submission
type QuizAnswer = {
  questionId: number;
  answer: string;
  isCorrect: boolean;
};

type QuizSubmission = {
  email: string;
  answers: QuizAnswer[];
};

// Validation schema for quiz submission
const QuizSubmissionSchema = z.object({
  email: z.string().email(),
  answers: z.array(z.object({
    questionId: z.number().min(1).max(5),
    answer: z.string(),
    isCorrect: z.boolean(),
  })).length(5),
}) satisfies z.Schema<QuizSubmission>;

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedData = QuizSubmissionSchema.parse(body);

    // Connect to database
    await connectDB();

    // Compute quiz results
    const { score, recommendation } = computeQuizResult(validatedData.answers);

    // Create quiz result document
    const quizResult = await QuizResult.create({
      ...validatedData,
      score,
      recommendation,
    });

    // Send email
    await sendQuizResultEmail({
      to: validatedData.email,
      score,
      recommendation,
    });

    // Return response
    return NextResponse.json({
      success: true,
      data: {
        id: quizResult._id,
        score,
        recommendation,
      },
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