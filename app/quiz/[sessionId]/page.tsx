'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { GlassCard, Button, LoadingCard, GradientText } from '@/components/ui';
import { IQuestion } from '@/models/QuizResult';
import { getSession, submitQuiz } from '@/app/actions';
import { motion, AnimatePresence } from 'framer-motion';

interface QuizState {
  topic: string;
  questions: IQuestion[];
  currentQuestion: number;
  answers: string[];
  isLoading: boolean;
  error: string | null;
}

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const containerVariants = {
  initial: { opacity: 0 },
  enter: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      when: 'beforeChildren',
    },
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0 },
};

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
        return {
          ...prev,
          answers: newAnswers,
          currentQuestion: prev.currentQuestion + 1,
        };
      } else {
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
      <motion.div 
        className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-4"
        initial="initial"
        animate="enter"
        exit="exit"
        variants={pageVariants}
      >
        <GlassCard className="max-w-2xl mx-auto">
          <LoadingCard message="Loading quiz questions..." />
        </GlassCard>
      </motion.div>
    );
  }

  if (state.error) {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-4"
        initial="initial"
        animate="enter"
        exit="exit"
        variants={pageVariants}
      >
        <GlassCard className="max-w-2xl mx-auto">
          <div className="text-center py-8">
            <motion.div 
              className="mb-6 text-red-500"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
            >
              <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </motion.div>
            <h2 className="text-xl font-semibold mb-2 dark:text-white">Something went wrong</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{state.error}</p>
            <Button onClick={() => router.push('/quiz/start')} variant="primary">
              Try Again
            </Button>
          </div>
        </GlassCard>
      </motion.div>
    );
  }

  const currentQ = state.questions[state.currentQuestion];

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-4"
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageVariants}
    >
      <GlassCard className="max-w-2xl mx-auto">
        <motion.div 
          className="p-6 space-y-8"
          variants={containerVariants}
          initial="initial"
          animate="enter"
        >
          {/* Progress bar */}
          <motion.div className="space-y-2" variants={itemVariants}>
            <div className="flex justify-between text-sm dark:text-gray-300">
              <span>Question {state.currentQuestion + 1} of {state.questions.length}</span>
              <span>Topic: <GradientText>{state.topic}</GradientText></span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <motion.div
                className="bg-gradient-to-r from-accent-primary to-accent-secondary h-2.5 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${((state.currentQuestion + 1) / state.questions.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </motion.div>

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={state.currentQuestion}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <h2 className="text-xl md:text-2xl font-semibold mb-6 dark:text-white">
                {currentQ.question}
              </h2>
              <div className="space-y-3">
                {currentQ.options.map((option, index) => (
                  <motion.button
                    key={index}
                    variants={itemVariants}
                    onClick={() => handleAnswer(option)}
                    className={`
                      w-full p-4 text-left rounded-lg transition-all
                      ${state.answers[state.currentQuestion] === option
                        ? 'bg-accent-primary/10 dark:bg-accent-primary/20 ring-2 ring-accent-primary dark:ring-accent-secondary'
                        : 'bg-white/50 dark:bg-gray-800/50 hover:bg-white/80 dark:hover:bg-gray-800/80'}
                      dark:text-white
                    `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {option}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <motion.div 
            className="flex justify-between"
            variants={itemVariants}
          >
            <Button
              onClick={() => setState(prev => ({ ...prev, currentQuestion: prev.currentQuestion - 1 }))}
              variant="outline"
              disabled={state.currentQuestion === 0}
            >
              ←Previous
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
              {state.currentQuestion === state.questions.length - 1 ? <span>✓</span> : <span>→</span>}{state.currentQuestion === state.questions.length - 1 ? 'Submit' : 'Next'}
            </Button>
          </motion.div>
        </motion.div>
      </GlassCard>
    </motion.div>
  );
}