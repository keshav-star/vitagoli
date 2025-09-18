'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type QuizAnswer = {
  questionId: number;
  answer: string;
  isCorrect: boolean;
};

type QuizContextType = {
  answers: QuizAnswer[];
  addAnswer: (questionId: number, answer: string, isCorrect: boolean) => void;
  email: string;
  setEmail: (email: string) => void;
  resetQuiz: () => void;
};

const QuizContext = createContext<QuizContextType | null>(null);

export function QuizProvider({ children }: { children: ReactNode }) {
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [email, setEmail] = useState<string>('');
  
  const addAnswer = (questionId: number, answer: string, isCorrect: boolean): void => {
    setAnswers(prev => {
      const newAnswers = [...prev];
      const existingIndex = newAnswers.findIndex(a => a.questionId === questionId);
      
      if (existingIndex !== -1) {
        newAnswers[existingIndex] = { questionId, answer, isCorrect };
      } else {
        newAnswers.push({ questionId, answer, isCorrect });
      }
      
      return newAnswers;
    });
  };

  const resetQuiz = () => {
    setAnswers([]);
    setEmail('');
  };

  return (
    <QuizContext.Provider value={{ 
      answers, 
      addAnswer, 
      email, 
      setEmail,
      resetQuiz,
    }}>
      {children}
    </QuizContext.Provider>
  );
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
}