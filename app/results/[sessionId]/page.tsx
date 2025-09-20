'use client';

import { GlassCard, Button, LoadingCard, GradientText } from '@/components/ui';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShareButton } from '@/components/share-button';
import { motion } from 'framer-motion';

interface QuizResponse {
  success: boolean;
  result?: IQuizResult;
  error?: string;
}

interface IQuizResult {
  _id: string;
  topic: string;
  score: number;
  feedback: string;
  questions: Array<{
    question: string;
    options: string[];
    correctAnswer: string;
  }>;
  answers: string[];
}

const pageVariants = {
  initial: { opacity: 0 },
  enter: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      when: 'beforeChildren',
    }
  },
};

const itemVariants = {
  initial: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0 },
};

export default function ResultPage({ params }: { params: { sessionId: string } }) {
  const [result, setResult] = useState<IQuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await fetch(`/api/quiz/result/${params.sessionId}`);
        const data: QuizResponse = await res.json();
        
        if (!data.success || !data.result) {
          throw new Error(data.error || 'Failed to fetch results');
        }
        
        setResult(data.result);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load quiz results';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    void fetchResult();
  }, [params.sessionId]);

  if (loading) {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-4"
        initial="initial"
        animate="enter"
        variants={pageVariants}
      >
        <GlassCard className="max-w-4xl mx-auto">
          <LoadingCard message="Loading quiz results..." />
        </GlassCard>
      </motion.div>
    );
  }

  if (error || !result) {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-4"
        initial="initial"
        animate="enter"
        variants={pageVariants}
      >
        <GlassCard className="max-w-4xl mx-auto">
          <div className="text-center py-8">
            <motion.div 
              className="mb-6 text-red-500 dark:text-red-400"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.5 }}
            >
              <svg className="w-16 h-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </motion.div>
            <h2 className="text-xl font-semibold mb-2 dark:text-white">Something went wrong</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">{error}</p>
            <Link href="/quiz/start">
              <Button variant="primary">Try Another Quiz</Button>
            </Link>
          </div>
        </GlassCard>
      </motion.div>
    );
  }

  const scorePercentage = (result.score / 5) * 100;
  const isExcellent = scorePercentage >= 80;
  const isGood = scorePercentage >= 60;

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-4"
      initial="initial"
      animate="enter"
      variants={pageVariants}
    >
      <div className="max-w-4xl mx-auto">
        <GlassCard className="mb-6">
          <motion.div 
            className="space-y-8 p-6"
            variants={pageVariants}
            initial="initial"
            animate="enter"
          >
            {/* Header */}
            <motion.div 
              className="text-center"
              variants={itemVariants}
            >
              <h1 className="text-3xl font-bold mb-2 dark:text-white">
                Quiz Results
              </h1>
              <p className="dark:text-gray-300">
                Topic: <GradientText>{result.topic}</GradientText>
              </p>
            </motion.div>

            {/* Score Circle */}
            <motion.div 
              className="flex justify-center"
              variants={itemVariants}
            >
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
                    className="dark:stroke-gray-700"
                  />
                  {/* Score circle */}
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="8"
                    strokeLinecap="round"
                    initial={{ strokeDasharray: "0, 282.7" }}
                    animate={{ strokeDasharray: `${scorePercentage * 2.827}, 282.7` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    transform="rotate(-90 50 50)"
                  />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="var(--color-accent-primary)" />
                      <stop offset="100%" stopColor="var(--color-accent-secondary)" />
                    </linearGradient>
                  </defs>
                </svg>
                <motion.div 
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="text-center">
                    <GradientText className="text-4xl font-bold">
                      {result.score}/5
                    </GradientText>
                    <div className="text-sm text-gray-500 dark:text-gray-400">points</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Feedback */}
            <motion.div 
              variants={itemVariants}
              className="backdrop-blur-lg bg-white/10 dark:bg-gray-800/30 rounded-xl p-6"
            >
              <h3 className="text-xl font-semibold mb-3 flex items-center dark:text-white">
                {isExcellent ? '🌟' : isGood ? '👍' : '💪'} Feedback
              </h3>
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {result.feedback.split('\n').map((paragraph: string, i: number) => (
                  paragraph.trim() && (
                    <p key={i} className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                      {paragraph}
                    </p>
                  )
                ))}
              </div>
            </motion.div>

            {/* Questions Review */}
            <motion.div 
              variants={itemVariants}
              className="space-y-6"
            >
              <h3 className="text-xl font-semibold dark:text-white">Question Review</h3>
              {result.questions.map((q, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="backdrop-blur-lg bg-white/10 dark:bg-gray-800/30 rounded-xl p-6"
                >
                  <p className="font-medium mb-4 dark:text-white">{q.question}</p>
                  <div className="space-y-2">
                    {q.options.map((option, j) => {
                      const isCorrect = option === q.correctAnswer;
                      const isUserAnswer = option === result.answers[i];
                      const bg = isCorrect
                        ? 'bg-green-100/80 dark:bg-green-900/30'
                        : isUserAnswer && !isCorrect
                        ? 'bg-red-100/80 dark:bg-red-900/30'
                        : 'bg-white/50 dark:bg-gray-700/50';
                      const border = isCorrect
                        ? 'border-green-500'
                        : isUserAnswer && !isCorrect
                        ? 'border-red-500'
                        : 'border-transparent';

                      return (
                        <motion.div
                          key={j}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (i * 0.1) + (j * 0.05) }}
                          className={`p-3 rounded-lg border-2 flex items-center backdrop-blur-sm ${bg} ${border}`}
                        >
                          <span className="flex-grow dark:text-white">{option}</span>
                          {isCorrect && (
                            <motion.span 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring" }}
                              className="text-green-600 dark:text-green-400"
                            >
                              ✓
                            </motion.span>
                          )}
                          {isUserAnswer && !isCorrect && (
                            <motion.span 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring" }}
                              className="text-red-600 dark:text-red-400"
                            >
                              ✗
                            </motion.span>
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Actions */}
            <motion.div 
              variants={itemVariants}
              className="flex justify-center space-x-4"
            >
              <Link href="/quiz/start">
                <Button 
                  variant="primary"
                >
                  ✨ Take Another Quiz
                </Button>
              </Link>
              <ShareButton topic={result.topic} score={result.score} />
            </motion.div>
          </motion.div>
        </GlassCard>
      </div>
    </motion.div>
  );
}