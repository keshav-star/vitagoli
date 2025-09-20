'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { QuizLayout, Card, Button } from '@/components/ui';
import { IQuestion } from '@/models/QuizResult';
import { getSession, submitQuiz } from '@/app/actions';
import { LoadingCard } from '@/components/loading';

interface QuizState {
  topic: string;
  questions: IQuestion[];
  currentQuestion: number;
  answers: string[];
  isLoading: boolean;
  error: string | null;
}

export default function QuizPage({ params }: { params: { sessionId: string } }) {
  const router = useRouter();
  const [state, setState] = useState<QuizState>({
    topic: '',
    questions: [],
    currentQuestion: 0,
    answers: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // In a production app, this would fetch from your session store
    // For now, we'll re-fetch the questions
    const fetchQuestions = async () => {
      try {
        const result = await getSession(params.sessionId);

        if (!result.success || !('topic' in result)) {
          throw new Error(result.error || 'Failed to fetch quiz');
        }

        setState(prev => ({
          ...prev,
          topic: result.topic,
          questions: result.questions,
          isLoading: false,
        }));
      } catch (err) {
        setState(prev => ({
          ...prev,
          error: 'Failed to load quiz. Please try again.',
          isLoading: false,
        }));
      }
    };

    fetchQuestions();
  }, [params.sessionId]);

  const handleAnswer = (answer: string) => {
    setState(prev => {
      const newAnswers = [...prev.answers];
      newAnswers[prev.currentQuestion] = answer;

      if (prev.currentQuestion < prev.questions.length - 1) {
        // Move to next question
        return {
          ...prev,
          answers: newAnswers,
          currentQuestion: prev.currentQuestion + 1,
        };
      } else {
        // Submit quiz
        handleSubmit(newAnswers);
        return {
          ...prev,
          answers: newAnswers,
          isLoading: true,
        };
      }
    });
  };

  const handleSubmit = async (answers: string[]) => {
    try {
      const result = await submitQuiz({
        sessionId: params.sessionId,
        topic: state.topic,
        questions: state.questions,
        answers,
      });

      if (!result.success) {
        throw new Error(result.error || 'Failed to submit quiz');
      }

            router.push(`/results/${result.sessionId}`);
    } catch (err) {
      setState(prev => ({
        ...prev,
        error: 'Failed to submit quiz. Please try again.',
        isLoading: false,
      }));
    }
  };

  if (state.isLoading) {
    return (
      <QuizLayout>
        <Card gradient>
          <LoadingCard message="Loading quiz questions..." />
        </Card>
      </QuizLayout>
    );
  }

  if (state.error) {
    return (
      <QuizLayout>
        <Card>
          <div className="text-center py-8">
            <div className="mb-6 text-red-500">
              <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-gray-600 mb-6">{state.error}</p>
            <Button onClick={() => router.push('/quiz/start')} variant="primary">
              Try Again
            </Button>
          </div>
        </Card>
      </QuizLayout>
    );
  }

  const currentQ = state.questions[state.currentQuestion];

  return (
    <QuizLayout>
      <Card gradient>
        <div className="p-6 space-y-8">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Question {state.currentQuestion + 1} of {state.questions.length}</span>
              <span>Topic: {state.topic}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${((state.currentQuestion + 1) / state.questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-6">{currentQ.question}</h2>
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className={`w-full p-4 text-left rounded-lg transition-all ${
                    state.answers[state.currentQuestion] === option
                      ? 'bg-indigo-100 ring-2 ring-indigo-500'
                      : 'bg-white/50 hover:bg-white/80'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              onClick={() => setState(prev => ({ ...prev, currentQuestion: prev.currentQuestion - 1 }))}
              variant="outline"
              disabled={state.currentQuestion === 0}
            >
              Previous
            </Button>
            <Button
              onClick={() => {
                if (state.answers[state.currentQuestion]) {
                  handleAnswer(state.answers[state.currentQuestion]);
                }
              }}
              variant="primary"
              disabled={!state.answers[state.currentQuestion]}
            >
              {state.currentQuestion === state.questions.length - 1 ? 'Submit' : 'Next'}
            </Button>
          </div>
        </div>
      </Card>
    </QuizLayout>
  );
}