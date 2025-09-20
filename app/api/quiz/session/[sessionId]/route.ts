import { NextRequest, NextResponse } from 'next/server';

// TODO: Replace with actual session storage (Redis, etc.)
interface QuizSession {
  id: string;
  topic: string;
  questions: Array<{
    id: number;
    question: string;
    options: string[];
    correctAnswer: string;
  }>;
  currentQuestion: number;
  createdAt: Date;
}

const sessions: Record<string, QuizSession> = {};

export async function GET(
  request: NextRequest,
  { params }: { params: { sessionId: string } }
) {
  try {
    const session = sessions[params.sessionId];

    if (!session) {
      return NextResponse.json(
        { success: false, error: 'Session not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      ...session,
    });
  } catch (error) {
    console.error('Error fetching session:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch session' },
      { status: 500 }
    );
  }
}