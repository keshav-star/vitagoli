import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongo';
import QuizResult from '@/models/QuizResult';

export async function GET(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'Quiz ID is required',
      }, { status: 400 });
    }

    await connectDB();
    
    const result = await QuizResult.findById(id);
    
    if (!result) {
      return NextResponse.json({
        success: false,
        error: 'Quiz result not found',
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: {
        score: result.score,
        recommendation: result.recommendation,
        createdAt: result.createdAt,
      },
    });
  } catch (error) {
    console.error('Error fetching quiz result:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch quiz result',
    }, { status: 500 });
  }
}