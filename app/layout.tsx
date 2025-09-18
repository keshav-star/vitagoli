import { QuizProvider } from '@/context/QuizContext';
import './globals.css';

export const metadata = {
  title: 'Quiz App',
  description: 'A simple quiz application',
};

import { ReactNode } from 'react';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QuizProvider>
          {children}
        </QuizProvider>
      </body>
    </html>
  );
}