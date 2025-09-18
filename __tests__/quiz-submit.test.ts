import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { POST } from '@/app/api/quiz/submit/route';
import QuizResult from '@/models/QuizResult';
import { sendQuizResultEmail } from '@/lib/email';

// Mock dependencies
jest.mock('@/lib/mongo', () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve()),
}));

jest.mock('@/lib/email', () => ({
  __esModule: true,
  sendQuizResultEmail: jest.fn(() => Promise.resolve({ status: 'success' })),
}));

jest.mock('@/models/QuizResult', () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
  },
}));

// Mock NextResponse
jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn((data, options) => ({ ...data, ...options })),
  },
}));

describe('Quiz Submission API', () => {
  const validQuizSubmission = {
    email: 'test@example.com',
    answers: [
      { questionId: 1, answer: 'Paris', isCorrect: true },
      { questionId: 2, answer: 'Mars', isCorrect: true },
      { questionId: 3, answer: 'Blue Whale', isCorrect: true },
      { questionId: 4, answer: 'Leonardo da Vinci', isCorrect: true },
      { questionId: 5, answer: 'Au', isCorrect: true },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('successfully processes a valid quiz submission', async () => {
    const mockQuizResult = {
      _id: 'mock-id-123',
      ...validQuizSubmission,
      score: 5,
      recommendation: 'Perfect score! You\'ve mastered these concepts. Time to tackle new challenges!',
    };

    QuizResult.create.mockResolvedValueOnce(mockQuizResult);

    const request = new Request('http://localhost:3000/api/quiz/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validQuizSubmission),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(QuizResult.create).toHaveBeenCalledTimes(1);
    expect(sendQuizResultEmail).toHaveBeenCalledWith({
      to: validQuizSubmission.email,
      score: 5,
      recommendation: expect.any(String),
    });
    expect(data.success).toBe(true);
    expect(data.data).toHaveProperty('id', 'mock-id-123');
  });

  it('handles invalid quiz submission data', async () => {
    const invalidSubmission = {
      email: 'invalid-email',
      answers: [{ questionId: 1, answer: 'Wrong' }], // Missing required fields
    };

    const request = new Request('http://localhost:3000/api/quiz/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(invalidSubmission),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(QuizResult.create).not.toHaveBeenCalled();
    expect(sendQuizResultEmail).not.toHaveBeenCalled();
    expect(data.success).toBe(false);
    expect(data.error).toBe('Invalid submission data');
  });

  it('handles database errors gracefully', async () => {
    QuizResult.create.mockRejectedValueOnce(new Error('Database error'));

    const request = new Request('http://localhost:3000/api/quiz/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validQuizSubmission),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(data.success).toBe(false);
    expect(data.error).toBe('Failed to process quiz submission');
  });
});