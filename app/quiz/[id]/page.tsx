'use client';

import { useQuiz } from '@/context/QuizContext';
import { useRouter } from 'next/navigation';
import { QuizLayout, Card, Button } from '@/components/ui';
import { QUIZ_QUESTIONS } from '@/lib/quiz-data';

interface QuizQuestionProps {
  params: {
    id: string;
  };
}

export default function QuizQuestion({ params }: QuizQuestionProps) {
  const router = useRouter();
  const questionId = parseInt(params.id, 10);
  const question = QUIZ_QUESTIONS[questionId - 1];
  const { addAnswer, answers } = useQuiz();

  if (!question) {
    router.replace('/');
    return null;
  }

  const currentAnswer = answers.find(a => a.questionId === questionId)?.answer;
  const progress = (questionId / QUIZ_QUESTIONS.length) * 100;

  const handleAnswer = (selectedAnswer: string) => {
    const isCorrect = selectedAnswer === question.correctAnswer;
    addAnswer(questionId, selectedAnswer, isCorrect);

    if (questionId < QUIZ_QUESTIONS.length) {
      router.push(`/quiz/${questionId + 1}`);
    } else {
      router.push('/quiz/submit');
    }
  };

  return (
    <QuizLayout>
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
          <span>Question {questionId} of {QUIZ_QUESTIONS.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <Card gradient>
        <div className="space-y-8">
          {/* Question */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">{question.question}</h2>
          </div>

          {/* Options */}
          <div className="grid gap-4">
            {question.options.map((option) => (
              <button
                key={option}
                onClick={() => handleAnswer(option)}
                className={`
                  w-full p-4 text-left rounded-xl transition-all duration-200
                  ${currentAnswer === option
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25'
                    : 'bg-white/50 hover:bg-white hover:shadow-md border border-gray-200'}
                  transform hover:scale-[1.02] active:scale-[0.98]
                `}
              >
                <div className="flex items-center space-x-3">
                  <div className={`
                    w-5 h-5 rounded-full flex items-center justify-center border-2
                    ${currentAnswer === option
                      ? 'border-white bg-white/20'
                      : 'border-gray-300'}
                  `}>
                    {currentAnswer === option && (
                      <div className="w-2 h-2 rounded-full bg-white" />
                    )}
                  </div>
                  <span className={`text-lg ${currentAnswer === option ? 'font-semibold' : ''}`}>
                    {option}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </Card>
    </QuizLayout>
  );
}