import { NextRequest, NextResponse } from 'next/server';
import { generateQuestions } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic } = body;

    if (!topic) {
      return NextResponse.json(
        { success: false, error: 'Topic is required' },
        { status: 400 }
      );
    }

    const questions = await generateQuestions(topic);
    const sessionId = Math.random().toString(36).substring(2, 15);

    // Store the questions in the session or cache for later use
    // For now, we'll pass them directly in the session ID
    // In a production app, you'd want to store this in Redis or similar
    const session = {
      id: sessionId,
      topic,
      questions,
      currentQuestion: 0,
      createdAt: new Date(),
    };

    // TODO: Store session data

    return NextResponse.json({
      success: true,
      sessionId,
    });
  } catch (error) {
    console.error('Error generating quiz:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate quiz' },
      { status: 500 }
    );
  }
}