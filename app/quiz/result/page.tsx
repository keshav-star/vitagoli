'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { QuizLayout, Card, Button, LoadingSpinner } from '@/components/ui';

interface QuizResult {
  score: number;
  recommendation: string;
  createdAt: string;
}

export default function QuizResult() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = searchParams.get('id');
    if (!id) {
      router.replace('/');
      return;
    }

    fetch(`/api/quiz/result?id=${id}`)
      .then(res => res.json())
      .then(data => {
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch result');
        }
        setResult(data.data);
      })
      .catch(err => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [searchParams, router]);

  if (loading) {
    return (
      <QuizLayout>
        <Card gradient>
          <div className="flex flex-col items-center justify-center py-12">
            <LoadingSpinner size="lg" />
            <p className="mt-4 text-gray-600">Loading your results...</p>
          </div>
        </Card>
      </QuizLayout>
    );
  }

  if (error) {
    return (
      <QuizLayout>
        <Card>
          <div className="text-center py-8">
            <div className="mb-6 text-red-500">
              <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => router.push('/')} variant="primary">
              Start New Quiz
            </Button>
          </div>
        </Card>
      </QuizLayout>
    );
  }

  if (!result) return null;

  const scorePercentage = (result.score / 5) * 100;
  const isExcellent = scorePercentage >= 80;
  const isGood = scorePercentage >= 60;

  return (
    <QuizLayout>
      <Card gradient>
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">Congratulations! 🎉</h1>
            <p className="text-gray-600">You&apos;ve completed the quiz</p>
          </div>

          {/* Score Circle */}
          <div className="flex justify-center">
            <div className="relative w-48 h-48">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="8"
                />
                {/* Score circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="url(#gradient)"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${scorePercentage * 2.827}, 282.7`}
                  transform="rotate(-90 50 50)"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#6366f1" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-600">
                    {result.score}/5
                  </div>
                  <div className="text-sm text-gray-500">points</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div className="bg-white/50 rounded-xl p-6 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-3 flex items-center">
              {isExcellent ? '🌟' : isGood ? '👍' : '💪'} Your Feedback
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {result.recommendation}
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col space-y-3">
            <Button onClick={() => router.push('/')} variant="primary" size="lg">
              Take Another Quiz
            </Button>
            <Button 
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'My Quiz Results',
                    text: `I scored ${result.score}/5 on the quiz!`,
                    url: window.location.href
                  }).catch(() => {});
                }
              }} 
              variant="outline"
            >
              Share Results
            </Button>
          </div>
        </div>
      </Card>
    </QuizLayout>
  );
}