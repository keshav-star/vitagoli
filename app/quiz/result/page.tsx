import { Suspense } from 'react';
import { QuizLayout } from '@/components/ui';
import { QuizResultContent } from '@/components/quiz-result';

export default function QuizResult() {
  return (
    <QuizLayout>
      <Suspense fallback={
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto" />
          <div className="h-48 bg-gray-200 rounded-full w-48 mx-auto" />
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>
        </div>
      }>
        <QuizResultContent />
      </Suspense>
    </QuizLayout>
  );
}