'use client';

import { useQuiz } from '@/context/QuizContext';
import { useRouter } from 'next/navigation';
import { QuizLayout, Card, Button } from '@/components/ui';
import { useState } from 'react';

export default function QuizSubmit() {
  const router = useRouter();
  const { answers, email, resetQuiz } = useQuiz();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (answers.length !== 5 || !email) {
      setError('Please complete all questions before submitting');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          answers,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit quiz');
      }

      router.push(`/quiz/result?id=${data.data.id}`);
      resetQuiz();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <QuizLayout>
      <Card>
        <h2 className="text-xl font-semibold mb-4">Submit Quiz</h2>
        
        <div className="space-y-4">
          <p>You have answered all {answers.length} questions.</p>
          
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="flex space-x-4">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
            </Button>
            
            <Button
              onClick={() => router.push('/quiz/1')}
              disabled={isSubmitting}
            >
              Review Answers
            </Button>
          </div>
        </div>
      </Card>
    </QuizLayout>
  );
}